import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { TariffDto, ServiceDto, ClubOwnerDto } from "@/src/shared/api/types/data-contracts";
import { useTheme } from "@/src/shared/use-theme";
import { ArrowBackIcon, InfoCircleIcon, PhoneIcon } from "@/src/shared/components/icons";
import { useGetClubById } from "@/src/shared/api/api-hooks/use-get-club-by-id";
import Tag from "@/src/shared/components/ui-kit/tag";
import Button from "@/src/shared/components/ui-kit/button";
import FavoriteToggleButton from "@/src/shared/components/FavoriteToggleButton";
import { Image } from "expo-image";
import ClubSeatsBadge from "@/src/shared/components/ClubSeatsBadge";

import ImagePlaceholder from "@/assets/club-mock/club.jpeg";
const AccordionDescription = ({ description }: { description: string }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  const handleTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;

    if (lines.length > 2) {
      setShowMoreButton(true);
    }
  };

  console.log(showMoreButton, "showMoreButton");

  return (
    <View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: "black",
        }}
        numberOfLines={isDescriptionExpanded ? undefined : 3}
        onTextLayout={handleTextLayout}
      >
        {description}
      </Text>

      {showMoreButton && (
        <TouchableOpacity
          onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          style={{ marginTop: 4 }}
        >
          <Text
            style={{
              color: "#007AFF",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {isDescriptionExpanded ? "Показать меньше" : "Показать больше"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ClubMap = ({
  // latitude,
  // longitude,
  availableSpots,
  totalSpots,
}: {
  // latitude: number;
  // longitude: number;
  availableSpots?: number | null;
  totalSpots?: number | null;
}) => {
  const occupied =
    totalSpots && availableSpots ? totalSpots - availableSpots : 0;
  const total = totalSpots || 0;

  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>Карта швартовок</Text>
        {!!totalSpots && (
          <ClubSeatsBadge occupied={occupied} total={total} variant="light" />
        )}
      </View>
      <View style={styles.mapPlaceholder}>
        <TouchableOpacity style={styles.expandButton} activeOpacity={0.7}>
          <View style={styles.expandIcon}>
            <View style={styles.expandIconContainer}>
              <View style={[styles.expandLine, styles.expandLineTop]} />
              <View style={[styles.expandLine, styles.expandLineRight]} />
              <View style={[styles.expandLine, styles.expandLineBottom]} />
              <View style={[styles.expandLine, styles.expandLineLeft]} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TariffsSection = ({ tariffs }: { tariffs?: TariffDto[] | null }) => {
  if (!tariffs || tariffs.length === 0) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return Math.round(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatUnit = (unit: string): string => {
    const lowerUnit = unit.toLowerCase();
    if (lowerUnit.includes("месяц") || lowerUnit.includes("month")) {
      return "месяц";
    }
    if (lowerUnit.includes("день") || lowerUnit.includes("day")) {
      return "день";
    }
    if (lowerUnit.includes("год") || lowerUnit.includes("year")) {
      return "год";
    }
    if (lowerUnit.includes("час") || lowerUnit.includes("hour")) {
      return "час";
    }
    return unit;
  };

  // Извлекаем название тарифа из unit (если unit содержит название типа "По ГИМС")
  const getTariffName = (unit: string): string => {
    // Если unit содержит "гимс" или "регистр", используем это как название
    const lowerUnit = unit.toLowerCase();
    if (lowerUnit.includes("гимс") || lowerUnit.includes("gims")) {
      return "По ГИМС";
    }
    if (lowerUnit.includes("регистр") || lowerUnit.includes("register")) {
      return "По регистру";
    }
    // Иначе используем unit как есть или первую часть до пробела
    return unit.split(" ")[0] || "Тариф";
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Тарифы</Text>
      <View style={styles.cardsContainer}>
        {tariffs.map((tariff) => (
          <View key={tariff.id} style={styles.tariffCard}>
            <View style={styles.tariffContent}>
              <View style={styles.tariffInfo}>
                <Text style={styles.tariffName}>{getTariffName(tariff.unit)}</Text>
                <Text style={styles.tariffSubtext}>За 1 метр</Text>
              </View>
              <Text style={styles.tariffPrice}>
                {formatPrice(tariff.pricePerUnit)} ₽/{formatUnit(tariff.unit)}
              </Text>
            </View>
            <Button
              type="primary"
              size="small"
              onPress={() => {
                // TODO: Обработка выбора тарифа
              }}
              style={styles.selectButton}
            >
              Выбрать
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};

const ServicesSection = ({ services }: { services?: ServiceDto[] | null }) => {
  if (!services || services.length === 0) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return Math.round(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Услуги</Text>
      </View>
      <View style={styles.cardsContainer}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>
              {formatPrice(service.pricePerUnit)} ₽/{service.unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const ContactAdminSection = ({ owner }: { owner?: ClubOwnerDto | null }) => {
  if (!owner || !owner.phone) {
    return null;
  }

  const handlePhoneCall = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Форматируем телефон в формате +7 (981) 843 60 70
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
  };

  const formattedPhone = formatPhoneNumber(owner.phone);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Связь с администратором</Text>
      <View style={styles.contactCard}>
        <Text style={styles.phoneText}>{formattedPhone}</Text>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handlePhoneCall(owner.phone!)}
          activeOpacity={0.7}
        >
          <PhoneIcon width={16} height={16} color="#19A7E9" />
          <Text style={styles.callButtonText}>Позвонить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FeaturesSection = ({ features }: { features?: string[] | null }) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Особенности</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureTag}>
            <Text style={styles.featureTagText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const ClubDetailsScreen: React.FC = () => {
  const { colors, sizes } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ clubId?: string }>();

  const clubId = params.clubId;
  const bottomSpacing = Math.max(insets.bottom, 16);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: club, isLoading, isError } = useGetClubById(clubId);

  const handleBack = () => {
    router.back();
  };

  const handlePhoneCall = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Добавить API вызов для добавления/удаления из избранного
  };

  if (!club) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <SafeAreaView style={styles.headerContainer} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowBackIcon width={24} height={24} color={colors.grey900} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "black",
            }}
          >
            Клуб не найден
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <SafeAreaView style={styles.headerContainer} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowBackIcon width={24} height={24} color={colors.grey900} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.primary500} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !club) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <SafeAreaView style={styles.headerContainer} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowBackIcon width={24} height={24} color={colors.grey900} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "black",
            }}
          >
            Ошибка загрузки данных
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const descriptionText = club.description || "";
  const shouldTruncate = descriptionText.length > 150;

  const imageSource = club.imageUrl ? { uri: club.imageUrl } : { uri: ImagePlaceholder };
  const displayDescription =
    isDescriptionExpanded || !shouldTruncate
      ? descriptionText
      : `${descriptionText.substring(0, 150)}...`;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowBackIcon width={24} height={24} color={colors.grey900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Детали</Text>
          <FavoriteToggleButton
            active={isFavorite}
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          />
        </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomSpacing + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.topContentWrapper}>
            <Image
              source={imageSource}
              style={styles.image}
            />

            <View style={styles.mainInfo}>
              <View style={{ flexDirection: "column", gap: 20 }}>
                <Text style={styles.headerName}>{club.name}</Text>
                <Text style={styles.address}>{club.address}</Text>
              </View>
              <AccordionDescription description={club?.description || ""} />
            </View>
          </View>

          <View style={styles.bottomContentWrapper}>
            {club.latitude && club.longitude && (
              <ClubMap
                // latitude={club.latitude}
                // longitude={club.longitude}
                availableSpots={club.availableSpots}
                totalSpots={club.totalSpots}
              />
            )}
            <TariffsSection tariffs={club.tariffs} />
            <ServicesSection services={club.services} />
            <ContactAdminSection owner={club.owner} />
            <FeaturesSection features={club.features} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    flex: 1,
    textAlign: "center",
  },
  favoriteButton: {
    width: 32,
    height: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F8FAFC",
  },
  image: {
    width: "100%",
    minHeight: 343,
    minWidth: 343,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
  },
  mainInfo: {
    flexDirection: "column",
    gap: 12,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  address: {
    fontSize: 14,
    fontWeight: "400",
    color: "black",
  },
  topContentWrapper: {
    backgroundColor: "white",
    padding: 20,
    borderEndEndRadius: 24,
    borderEndStartRadius: 24,
  },
  bottomContentWrapper: {
    padding: 20,
  },
  mapContainer: {
    flexDirection: "column",
    gap: 12,
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    fontFamily: "Onest",
  },
  mapPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#EFF3F8",
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
  },
  expandButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandIcon: {
    width: 20,
    height: 20,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  expandIconContainer: {
    width: 16,
    height: 16,
    position: "relative",
  },
  expandLine: {
    position: "absolute",
    backgroundColor: "#5A6E8A",
  },
  expandLineTop: {
    top: 0,
    left: 0,
    width: 8,
    height: 2,
    borderTopLeftRadius: 1,
  },
  expandLineRight: {
    top: 0,
    right: 0,
    width: 2,
    height: 8,
    borderTopRightRadius: 1,
  },
  expandLineBottom: {
    bottom: 0,
    right: 0,
    width: 8,
    height: 2,
    borderBottomRightRadius: 1,
  },
  expandLineLeft: {
    bottom: 0,
    left: 0,
    width: 2,
    height: 8,
    borderBottomLeftRadius: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    fontFamily: "Onest",
    marginBottom: 15,
  },
  cardsContainer: {
    flexDirection: "column",
    gap: 12,
  },
  tariffCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tariffContent: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  tariffInfo: {
    flexDirection: "column",
    gap: 4,
  },
  tariffName: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    fontFamily: "Onest",
  },
  tariffSubtext: {
    fontSize: 14,
    fontWeight: "400",
    color: "#19A7E9",
    fontFamily: "Onest",
  },
  tariffPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    fontFamily: "Onest",
    marginTop: 4,
  },
  selectButton: {
    marginLeft: 16,
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    fontFamily: "Onest",
    flex: 1,
    marginRight: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    fontFamily: "Onest",
  },
  contactCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phoneText: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    fontFamily: "Onest",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#EFF3F8",
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#19A7E9",
    fontFamily: "Onest",
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featureTag: {
    backgroundColor: "#EFF3F8",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  featureTagText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#19A7E9",
    fontFamily: "Onest",
  },
});

export default ClubDetailsScreen;
