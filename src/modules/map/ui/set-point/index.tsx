import { MarkerView } from '@rnmapbox/maps'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export const PointToClubCreation: React.FC<{ point: GeoJSON.Feature }> = ({ point }) => {
  return (
    <MarkerView
      coordinate={point.geometry?.coordinates}
    >
      <View style={styles.marker}>
      </View>
    </MarkerView>
  )
}

const styles = StyleSheet.create({
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0084FF',
  },
})