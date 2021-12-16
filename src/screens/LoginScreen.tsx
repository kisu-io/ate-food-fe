import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { TextField } from "../components";
import { ButtonWithTitle } from "../components/ButtonWithTitle";
import { connect } from "react-redux";
import {
  ApplicationState,
  onUserLogin,
  onUserSignup,
  UserState,
  onOTPRequest,
  onVerifyOTP,
} from "../redux";
import { useNavigation } from "../utils";

interface LoginProps {
  onUserLogin: Function;
  onUserSignup: Function;
  userReducer: UserState;
  onOTPRequest: Function;
  onVerifyOTP: Function;
}

const _LoginScreen: React.FC<LoginProps> = ({
  onUserLogin,
  onUserSignup,
  userReducer,
  onOTPRequest,
  onVerifyOTP,
}) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("Login");
  const [isSignup, setIsSignup] = useState(false);

  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(true);
  const [requestOtpTitle, setRequestOtpTitle] = useState("Request a new OTP in");
  const [canRequestOtp, setCanRequestOtp] = useState(false);
  const { navigate } = useNavigation();

  let countDown: number;

  const { user } = userReducer;

  useEffect(() => {
    if (user.token !== undefined) {
      if (user.verified === true) {
        navigate("CartPage");
      } else {
        setVerified(user.verified);
        onEnableOtpRequest();
      }
    }

    return () => {
      clearInterval(countDown);
    };
  }, [user]);

  const onEnableOtpRequest = () => {
    const otpDate = new Date();
    otpDate.setTime(new Date().getTime() + 120000);
    const otpTime = otpDate.getTime();

    countDown = window.setInterval(function () {
      const currentTime = new Date().getTime();
      const totalTime = otpTime - currentTime;

      let minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
      setRequestOtpTitle(`Request a New OTP in ${minutes}:${seconds}`);

      if (minutes < 1 && seconds < 1) {
        setRequestOtpTitle(`Request a New OTP`);
        setCanRequestOtp(true);
        clearInterval(countDown);
      }
    }, 1000);
  };

  const onTapVerify = () => {
    onVerifyOTP(otp, user);
  };

  const onTapAuthenticate = () => {
    if (isSignup) {
      onUserSignup(email, phone, password);
    } else {
      onUserLogin(email, password);
    }
  };

  const onTapOptions = () => {
    setIsSignup(!isSignup);
    setTitle(!isSignup ? "Signup" : "Login");
  };

  const onTapRequestNewOTP = () => {
    setCanRequestOtp(false);
    onOTPRequest(user);
  };

  if (!verified) {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Image
            source={require("../images/verify_otp.png")}
            style={{ width: 120, height: 120, margin: 20 }}
          />
          <Text style={{ fontSize: 22, fontWeight: "500", margin: 10 }}>Verification</Text>
          <Text style={{ fontSize: 16, padding: 10, marginBottom: 20, color: "#716F6F" }}>
            Enter the OTP number sent to your mobile
          </Text>
          <TextField isOTP={true} placeholder='OTP' onTextChange={setOtp} />
          <ButtonWithTitle title='Verify OTP' onTap={onTapVerify} width={300} height={50} />
          <ButtonWithTitle
            disable={!canRequestOtp}
            title={requestOtpTitle}
            onTap={onTapRequestNewOTP}
            isNoBg={true}
            width={200}
            height={50}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.navigation}>
          <Text style={{ fontSize: 30, fontWeight: "400" }}>{title}</Text>
        </View>
        <View style={styles.body}>
          <TextField placeholder='Email ID' onTextChange={setEmail} isSecure={false} />

          {isSignup && (
            <TextField placeholder='Phone Number' onTextChange={setPhone} isSecure={false} />
          )}
          <TextField placeholder='Password' onTextChange={setPassword} isSecure={true} />

          <ButtonWithTitle title={title} height={50} width={350} onTap={onTapAuthenticate} />

          <ButtonWithTitle
            title={!isSignup ? "No Account? Signup Here" : "Have an Account? Login Here"}
            height={50}
            width={350}
            onTap={onTapOptions}
            isNoBg={true}
          />
        </View>
        <View style={styles.footer}></View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100 },
  navigation: { flex: 3, justifyContent: "center", paddingLeft: 30 },
  body: { flex: 6, justifyContent: "center", alignItems: "center" },
  footer: { flex: 3 },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

const LoginScreen = connect(mapStateToProps, {
  onUserLogin,
  onUserSignup,
  onOTPRequest,
  onVerifyOTP,
})(_LoginScreen);

export { LoginScreen };
