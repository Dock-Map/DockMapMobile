import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/src/modules/auth/stores/auth.store';
import { OnboardingSlideType } from '@/src/shared/types/onboarding';
import { useTheme } from '@/src/shared/use-theme';
import BackgroundCircles from '@components/ui-kit/background-circles';
import Button from '@components/ui-kit/button';
import OnboardingPagination from '@components/ui-kit/onboarding-pagination';
import OnboardingSlide from '@components/ui-kit/onboarding-slide';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const slideInnerWidth = width;

const OnboardingScreen: React.FC = () => {
  const { colors, fonts, weights, sizes } = useTheme();
  const { setIsFirstEnter } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const styles = getStyles(colors);

  const slides: OnboardingSlideType[] = [
    {
      id: 1,
      title: 'Добро пожаловать\nв Dock Map',
      description: 'Быстрое бронирование причалов\nи управление сервисами',
      image: 'welcome',
    },
    {
      id: 2,
      title: 'Мгновенный поиск швартовок',
      description: 'Выбирайте клуб по карте, проверяйте\n доступные места и бронируйте причал\n в пару кликов',
      image: 'search',
    },
    {
      id: 3,
      title: 'Управление услугами',
      description: 'От построения интерактивной карты\n причала до управления бронированиями\n и расписанием',
      image: 'services',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setIsProgrammaticScroll(true);
      scrollViewRef.current?.scrollTo({ x: nextSlide * width, animated: true });
      setTimeout(() => {
        setCurrentSlide(nextSlide);
        setIsProgrammaticScroll(false);
      }, 300);
    } else {
      setIsFirstEnter(true);
      router.replace("/(auth)");
    }
  };

  const handleSkip = () => {
    setIsFirstEnter(true);
    router.replace("/(auth)");
  };

  const handleScroll = (event: any) => {
    if (isProgrammaticScroll) return;
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex >= 0 && slideIndex < slides.length) {
      setCurrentSlide(slideIndex);
    }
  };

  const renderSlideContent = (slide: OnboardingSlideType) => {
    switch (slide.image) {
      case 'welcome':
        return null;
      case 'search':
        return (
          <Image
            source={require('@/assets/images/onboarding-slide-2.png')}
            style={styles.searchImage}
          />
        );
      case 'services':
        return null;
      default:
        return null;
    }
  };

  const renderBackgroundCircles = (slide: OnboardingSlideType) => {
    return <BackgroundCircles variant={slide.image as any} />;
  };

  return (
    <View style={styles.fullScreenContainer}>
      {/* Фоновые круги для текущего слайда */}
      <View style={styles.backgroundContainer}>
        {renderBackgroundCircles(slides[currentSlide])}
      </View>
      
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={[styles.slide, { width }]}>
              <OnboardingSlide
                title={slide.title}
                description={slide.description}
                pagination={
                  <OnboardingPagination
                    totalSlides={slides.length}
                    currentSlide={currentSlide}
                  />
                }
              >
                {renderSlideContent(slide)}
              </OnboardingSlide>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            {currentSlide < slides.length - 1 && (
              <Button
                type="secondary"
                onPress={handleSkip}
                containerStyle={styles.skipButton}
              >
                Пропустить
              </Button>
            )}
            
            <Button
              type="primary"
              onPress={handleNext}
              containerStyle={
                currentSlide === slides.length - 1 
                  ? styles.startButton 
                  : styles.nextButton
              }
            >
              {currentSlide === slides.length - 1 ? 'Начать' : 'Далее'}
            </Button>
          </View>
        </View>
      </View>
      </SafeAreaView>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bottomSection: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  startButton: {
    flex: 1,
  },


  searchImage: {
    width: 327,
    height: 400,
    borderRadius: 40,
  },


});

export default OnboardingScreen;
