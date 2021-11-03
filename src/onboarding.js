import { StatusBar } from 'expo-status-bar';
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Animated, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import onboardData from "./onboardData"
import OnboardingItem from './onboardingItem';

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState("")
  const [valid, setValid] = useState(false)
  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef()

  const [isrecording, setisRecording] = useState(false)
  const [recording, setRecording] = useState();
  const [recordinguri, setRecordinguri] = useState("");

  const [isspeaking, setIsspeaking] = useState(false)

  const [micvisible, setMicvisible] = useState(false)

  const [answer, setAnswer] = useState("")
  const [name, setName] = useState("")
  const [phonenumber, setPhonenumber] = useState("")
  const [email, setEmail] = useState("")

  const [confirmation, setConfirmation] = useState(false)

  
  const ENCODING = 'LINEAR16';
  const SAMPLE_RATE_HERTZ = 16000;
  const LANGUAGE = 'en-US';

  const audioConfig = {
      encoding: ENCODING,
      sampleRateHertz: SAMPLE_RATE_HERTZ,
      languageCode: LANGUAGE,
  };


  const intro = "Hello, I'm Jenny, and I'm here to walk you through the onboarding process, and this would require you to press the microphone button when responding. So, let's get started!"
  const nameIntro = "First off,may I know your name?"
  const pnumber = "Next step is your phone number. Please say it in a slow and precise manner"
  const emailIntro = "Finally, do you mind telling me your email address?"
  const verifyIntro = name + ", To verify your credentials, an email would be sent to " + email + ", and a code would be sent to " + phonenumber + ". Do have a nice day"
  useEffect(async () => {
    introduction()
  }, [])

  const speak = () => {

  }
  const introduction = async () => {
    await texttospeech(intro)
    setTimeout(() => setValid(true), 11000);
  }

  const startRecording = async () => {
    setMicvisible(true)
    try {
      console.log("Requesting permission");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: true,
      });
      console.log("Starting recording")
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      setRecording(recording)
      setisRecording(true)
      console.log("Recording started")

    }catch(err){
      console.error("Failed to start recording", err)
      setMicvisible(false)
      setisRecording(false)
    }
  }

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setisRecording(false)
    setMicvisible(false)
    setRecording(undefined)
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    //console.log('Recording stopped and stored at', uri);
    GLOBAL.recordData = uri
    getTranscription()
  }

  const getTranscription = async () => {
    var url = "https://speech.googleapis.com/v1p1beta1/speech:recognize?key=AXXXBgcbT0-pXXXXGoJHAUeQXXXXmdWp88"
    console.log("Getting Transcription")
    try {
      const base64data = await FileSystem.readAsStringAsync(recordData, {encoding: FileSystem.EncodingType.Base64});
      var b6d = "data:audio/wav;base64," + base64data
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': "None",
          Accept: "Application/json",
          'Content-Type': "Application/json",
          "Charset": "UTF-8"
        },
        body: JSON.stringify({
          "config": {
            "encoding": "LINEAR16",     
            "sampleRateHertz": 42000,     
            "languageCode": "en-US"   
          },
          "audio": {
            "content": base64data,
          }
        })
      });
      const data = await response.json();
      console.log(data)
      console.log(data.results[0].alternatives[0].transcript)
      if(confirmation){
        var res = data.results[0].alternatives[0].transcript
        confirmAnswer(res.toLowerCase())
      }else{
        getInput(data.results[0].alternatives[0].transcript)
      }
      //setAnswer(data.results[0].alternatives[0].transcript)
    } catch(error) {
      console.log('There was an error', error);
      stopRecording();
    }
  }
  

  const recordingOptions = {
    // android not currently in use, but parameters are required
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
  };

  const TextInput = (answer) => {
    if (onboardData.length > currentIndex + 1){
      if(currentIndex == 1){
        setName(answer)
        setTimeout(() => texttospeech("Nice to meet you " + answer + ", please proceed to the next screen."), 0);
        setValid(true)
      }
      else if(currentIndex == 2){
        setPhonenumber(answer)
        setTimeout(() => texttospeech("Thanks for the input, your phone number has been stored successfully"), 0);
        setValid(true)
      }
      else if(currentIndex == 3){
        setEmail(answer)
        setTimeout(() => texttospeech("Great, I think that's all i need to know. Thanks so much for your patience " + name), 0);
        setValid(true)
      }
    }
  }

  const Input = () => {
    Alert.prompt(
      currentIndex == 1? ("Name"):(currentIndex == 2? ("Phone Number"):("Email")),
      currentIndex == 1? ("Enter your correct Name"):(currentIndex == 2? ("Enter your correct Phone Number"):("Enter your correct Email")),
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: val => TextInput(val)
          }
        ],
        "plain-text",
      );
};


  const next = (index) => {
    if (onboardData.length > index + 1){
      slidesRef.current.scrollToIndex({ animated: true, index: index + 1})
      console.log(currentIndex)
      setValid(false)
      if(currentIndex + 1 == 1){
        setTimeout(() => texttospeech(nameIntro), 0);
      }
      else if(currentIndex + 1 == 2){
        setTimeout(() => texttospeech(pnumber), 0);
       
      }
      else if(currentIndex + 1 == 3){
        setTimeout(() => texttospeech(emailIntro), 0);
        
      }
      else if(currentIndex + 1 == 4){
        setTimeout(() => texttospeech(verifyIntro), 0);
        
      }
    }
  }

  const getInput = (answer) => {
    alert(answer.replace(" ", ""))
    console.log(currentIndex )
    if (onboardData.length > currentIndex + 1){
      setValid(false)
      if(currentIndex == 1){
        setName(answer.replace(" ", ""))
        setTimeout(() => texttospeech("Is your name spelt correctly?, please reply with a yes or a no."), 0);
        setConfirmation(true)
      }
      else if(currentIndex == 2){
        setPhonenumber(answer.replace(" ", ""))
        setTimeout(() => texttospeech("Is your phone number correct?, please reply with a yes or a no."), 0);
        setConfirmation(true)
        //setTimeout(() => setValid(true), 3000);
      }
      else if(currentIndex == 3){
        setEmail(answer.replace(" ", ""))
        setTimeout(() => texttospeech("Is your email correct?, please reply with a yes or a no."), 0);
        setConfirmation(true)
        //setTimeout(() => setValid(true), 3000);
      }
    }
  }

  const confirmAnswer = (answer) => {
    if (onboardData.length > currentIndex + 1){
      setValid(false)
      if(currentIndex == 1){
        if(answer == "yes"){
          setTimeout(() => texttospeech("Good to know that. Nice to meet you " + name + ", please proceed to the next screen."), 0);
          setTimeout(() => setValid(true), 3000);
          setConfirmation(false)
        }else{
          setTimeout(() => texttospeech("So sorry for my poor listening skills. Please type your name in the text box provided and proceed"), 0);
          setTimeout(() => Input(), 5000);
          setConfirmation(false)
        }
      }
      else if(currentIndex == 2){
        if(answer == "yes"){
          setTimeout(() => texttospeech("Thats great, just a step left. Let's proceed"), 0);
          setTimeout(() => setValid(true), 3000);
          setConfirmation(false)
        }else{
          setTimeout(() => texttospeech("So sorry for my poor listening skills. Please type your number in the text box provided and proceed"), 0);
          setTimeout(() => Input(), 5000);
          setConfirmation(false)
        }
      }
      else if(currentIndex == 3){
        if(answer == "yes"){
          setTimeout(() => texttospeech("Great, I think that's all i need to know. Thanks so much for your patience " + name), 0);
          setTimeout(() => setValid(true), 3000);
          setConfirmation(false)
        }else{
          setTimeout(() => texttospeech("So sorry for my poor listening skills. Please type your email in the text box provided and proceed"), 0);
          setTimeout(() => Input(), 5000);
          setConfirmation(false)
        }
      }
    }
  }

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index)
  }).current

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current

  const texttospeech = (text) => {
    var url = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyBgXXXpXXYVGoXXXXXAwqXXXWp88'
    var data = {
      'input':{
         'text': text
      },
      'voice':{
         'languageCode':'en-gb',
         'name':'en-GB-Standard-A',
         'ssmlGender':'FEMALE'
      },
      'audioConfig':{
      'audioEncoding':'MP3'
      }
     };
     var otherparam={
        headers:{
           "content-type":"application/json; charset=UTF-8"
        },
        body:JSON.stringify(data),
        method:"POST"
     };
    fetch(url,otherparam)
    .then(data=>{return data.json()})
    .then(async res =>{
      var name = "data:audio/mpeg;base64," + res.audioContent
      //console.log(name)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
      const sound = new Audio.Sound();
      try {
        await sound.loadAsync({
          uri: name
        });
        await sound.playAsync();
        //await sound.unloadAsync();
      } catch (error) {
        // An error occurred!
      }
    })
    .catch(error=>{
      //console.log(error)
      texttospeech(text)
    })
  };

  return (
    <View style={styles.container}>
        <View style={{flex: 3}}>
            <FlatList 
            data={onboardData} 
            renderItem={({item}) => <OnboardingItem item={item}/>}
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={ () => {
              Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false,})
            }
            }
            scrollEnabled={false}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
            />
        </View>
        {valid?(<TouchableOpacity onPress={() => next(currentIndex)} style={{width: 70, height: 70, borderRadius: 40, backgroundColor: "#493d8a", position: "absolute", right: 20, bottom: 20, alignItems: "center", justifyContent: "center"}}>
          <AntDesign name="arrowright" size={30} color="#fff" />
        </TouchableOpacity>):(<View/>)}
        {currentIndex == 0 || currentIndex == 4 ? (<View/>):(<TouchableOpacity disabled={isspeaking} onPress={() => isrecording ? stopRecording() : startRecording()} style={{width: 70, height: 70, borderRadius: 40, backgroundColor: "#493d8a", position: "absolute", left: 20, bottom: 20, alignItems: "center", justifyContent: "center"}}>
          {isrecording? (<FontAwesome name="microphone-slash" size={30} color="#fff" />):(<FontAwesome name="microphone" size={30} color="#fff" />)}
        </TouchableOpacity>)}
        {micvisible? (<SafeAreaView style={{width: 200, height: 40, backgroundColor: isrecording? ("#449954"):("#dcdc9f"), borderRadius: 7, position: "absolute", alignSelf: "center", top: 50, alignItems: "center", justifyContent: "center"}}>{isrecording ? (<Text>Listening...</Text>):(<Text>Wait...</Text>)}</SafeAreaView>):(<View/>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
