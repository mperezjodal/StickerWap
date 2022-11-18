import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  useColorScheme,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';

import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'translations';
import spacingStyles from 'styles/spacing';
import { Cross, Tick } from 'assets';
import api from 'utils/openUrl/api';
import { cateogryMap, newShade } from 'screens/Collection/utils';
import socket from 'utils/socket';
import { useSelector } from 'react-redux';
import Sticker from 'screens/Swipe/Sticker';

const Swipe = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [swipeData, setSwipeData] = useState<any>();
  const [ad, setAd] = useState<any>();
  const [countryData, setCountryData] = useState<any>();
  const { id } = useSelector((state: RootState) => state.auth.data);

  const handleChat = (name: string, user1: string, user2: string) => {
    socket.emit('createChat', name, user1, user2);
  };

  const handleSwipeTick = async () => {
    if (ad) {
      const supported = await Linking.canOpenURL(ad?.link);

      if (supported) {
        await Linking.openURL(ad?.link);
      }
    } else {
      api
        .post('/swipe', {
          user_id: swipeData.user_id,
          randomSticker: swipeData.sticker,
        })
        .then(res => {
          handleChat('testtttt', '6369ac9cda56ac6f887f6438', id);
        })
        .catch(err => console.log(err));
    }
    getStickerData();
  };

  const handleSwipeCross = () => {
    getStickerData();
  };

  const getStickerData = () =>
    api.get('/swipe').then(async (data: any) => {
      if (data?.response?.status === 400) {
        throw data?.response?.data?.error;
      }
      if (data.data.ad) {
        setAd(data.data.ad);
      } else {
        setSwipeData(data.data);
        setCountryData(cateogryMap(data.data.sticker.category));
        setAd(data.data.ad);
      }
    });

  useEffect(() => {
    getStickerData();
  }, []);

  return (
    <SafeAreaView style={spacingStyles.mainScreen}>
      {/* <ScrollView contentInsetAdjustmentBehavior="automatic"> */}
      <View style={styles.container}>
        <LinearGradient
          colors={['#04B600', '#0094FF']}
          style={styles.linearGradient}
        >
          <Text style={styles.bigHeader}>{i18n.t('swipe.title')}</Text>
        </LinearGradient>

        <Sticker ad={ad} swipeData={swipeData} countryData={countryData} />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonGreen}
            onPress={handleSwipeCross}
          >
            <LinearGradient
              colors={['#FF8A00', '#E12900']}
              style={styles.linearGradientButton}
            >
              <Image
                source={Cross}
                style={{ tintColor: 'white', width: 20, height: 20 }}
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonRed} onPress={handleSwipeTick}>
            <LinearGradient
              colors={['#58DBDB', '#58DB72']}
              style={styles.linearGradientButton}
            >
              <Image
                source={Tick}
                style={{ tintColor: 'white', width: 25, height: 25 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Swipe;
