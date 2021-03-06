import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import {emailValidstatus} from '../../modules/auth';
import {useForm, Controller} from 'react-hook-form';
import { css } from '@emotion/native';

const LoginScreen = ({
  navigation,
  form,
  forgetPassword,
  onCreateAddress,
  onChangeLoginEmail,
  onChangeLoginPassword,
  onSubmitLogin,
  onChangeFindEmail,
  onChangeFindCode,
  onChangeFindPassword,
  onChangeFindPasswordConfirm,
  onSendAuthEmailForPasswordChange,
  onConfirmAuthEmail,
  onSubmitChangePassword,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const {isEmailvalidedAtPasswordFind} = useSelector(({auth}) => ({
    isEmailvalidedAtPasswordFind: auth.isEmailvalidedAtPasswordFind,
  }));
  const {isLoading} = useSelector(({loading}) => ({
    isLoading: loading.isLoading,
  }));

  const visibleText = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  const addToBehindText = (e) => {
    onCreateAddress(
      e.nativeEvent.text.includes('@')
        ? e.nativeEvent.text
        : `${e.nativeEvent.text}@jbnu.ac.kr`,
    );
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const dispatch = useDispatch();

  const {control, handleSubmit, trigger, watch, errors} = useForm({ mode: 'onChange' });
  // const onSubmit = (data) => console.log(data);

  return (
    <>
      {isLoading && (
        <View
          style={css`
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            opacity: 0.5;
            background-color: gray;
            align-items: center;
            justify-content: center;
            z-index: 999;
          `}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <View style={css`flex: 1; justify-content: center; align-items: center`}>
        <View style={css`align-items: center; margin-bottom: 15px`}>
          <Text style={css`align-self: flex-start; margin-bottom: 5px`}>
            학교 웹메일
          </Text>
          <Controller
            control={control}
            render={({value, onBlur, onChange}) => (
              <TextInput
                name="email"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={(form.email, value)}
                onChange={onChangeLoginEmail}
                onEndEditing={addToBehindText}
              />
            )}
            name="email"
            rules={{required: true, pattern: /^\S+@\S+$/i}}
            defaultValue=""
          />
          {errors.email && errors.email.type === 'required' && (
            <Text
              style={css`
                color: #f54260;
                align-self: flex-start;
                margin-bottom: 10px;
              `}>
              이메일을 입력해 주세요
            </Text>
          )}
          {errors.email && errors.email.type === 'pattern' && (
            <Text
              style={css`
                color: #f54260;
                align-self: flex-start;
                margin-bottom: 10px;
              `}>
              이메일 형식에 맞게 작성 해주세요
            </Text>
          )}

          <Text style={css`align-self: flex-start; margin-bottom: 5px`}>
            비밀번호
          </Text>

          <View style={css`flex-direction: row; align-items: center`}>
            <Controller
              control={control}
              render={({value, onBlur, onChange}) => (
                <TextInput
                  name="password"
                  style={[styles.input, css`margin-left: -10px`]}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={(form.password, value)}
                  onChange={onChangeLoginPassword}
                  secureTextEntry={isPasswordVisible}
                />
              )}
              name="password"
              rules={{required: true}}
              defaultValue=""
            />
            <View style={css`margin-right: -30px`} />
            {isPasswordVisible ? (
              <Ionicons
                name="eye-off-outline"
                size={20}
                onPress={visibleText}
              />
            ) : (
              <Ionicons name="eye-outline" size={20} onPress={visibleText} />
            )}
          </View>
          {errors.password && (
            <Text
              style={css`
                color: #f54260;
                align-self: flex-start;
                margin-bottom: 10px;
              `}>
              비밀번호를 입력해 주세요
            </Text>
          )}
        </View>

        <Modal isVisible={isModalVisible}>
          <View
            style={css`
              flex: 1;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            `}>
            <View
              style={css`
                background-color: white;
                width: 250px;
                height: 250px;
                borderRadius: 5px;
              `}>
              {isLoading && (
                <View
                style={css`
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: 0;
                  bottom: 0;
                  opacity: 0.5;
                  background-color: gray;
                  align-items: center;
                  justify-content: center;
                  z-index: 999;
                `}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
              <View
                style={css`
                  height: 50px;
                  justify-content: center;
                  align-items: center;
                  border-bottom-width: 0.5px;
                  border-color: gray;
                `}>
                {isEmailvalidedAtPasswordFind ? (
                  <Text style={css`font-size: 18px`}>비밀번호 변경</Text>
                ) : (
                  <>
                    <Text style={css`font-size: 12px`}>이메일 인증을 통한</Text>
                    <Text style={css`font-size: 18px`}>비밀번호 찾기</Text>
                  </>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  toggleModal();
                  dispatch(
                    emailValidstatus({
                      form: 'isEmailvalidedAtPasswordFind',
                      value: false,
                    }),
                  );
                }}
                style={css`
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  margin-bottom: 10px;
                  margin-right: 15px;
                `}>
                <Text>나가기</Text>
              </TouchableOpacity>
              {isEmailvalidedAtPasswordFind ? (
                <View
                  style={css`
                    align-items: center;
                    margin-top: 10px;
                  `}>
                  <TextInput
                    placeholder="변경할 비밀번호 입력"
                    placeholderTextColor="black"
                    style={css`
                      border-bottom-width: 1px;
                      border-color: gray;
                      opacity: 0.5;
                      width: 150px;
                      height: 45px;
                      padding-left: 10px;
                      margin-right: 10px;
                    `}
                    value={forgetPassword.password}
                    onChange={onChangeFindPassword}
                    secureTextEntry
                  />
                  <TextInput
                    placeholder="비밀번호 확인"
                    placeholderTextColor="black"
                    style={css`
                      border-bottom-width: 1px;
                      border-color: gray;
                      opacity: 0.5;
                      width: 150px;
                      height: 45px;
                      padding-left: 10px;
                      margin-bottom: 10px;
                      margin-right: 10px;
                    `}
                    value={forgetPassword.passwordConfirm}
                    onChange={onChangeFindPasswordConfirm}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={css`
                      background-color: #5e5e5e;
                      border-radius: 5px;
                      padding: 12px 4px;
                      margin-top: 5px;
                      width: 66px;
                    `}
                    onPress={() => {
                      onSubmitChangePassword();
                      toggleModal(); //변경하기후에 나가지지 않으면 지우기
                    }}
                    >
                    <Text style={css`color: white; text-align: center`}>변경하기</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View
                    style={css`
                      flex-direction: row;
                      align-items: center;
                      justify-content: center;
                      margin-top: 30px;
                    `}>
                    <TextInput
                      placeholder="학교이메일 입력"
                      placeholderTextColor="black"
                      style={css`
                        border-bottom-width: 1px;
                        border-color: gray;
                        opacity: 0.5;
                        width: 150px;
                        height: 45px;
                        padding-left: 10px;
                        margin-bottom: 10px;
                        margin-right: 10px;
                      `}
                      value={forgetPassword.email}
                      onChange={onChangeFindEmail}
                      onEndEditing={addToBehindText}
                    />
                    <TouchableOpacity
                      style={css`
                        background-color: #5e5e5e;
                        border-radius: 5px;
                        padding: 12px 12px;
                        width: 61px;
                      `}
                      onPress={onSendAuthEmailForPasswordChange}
                      >
                      <Text style={css`color: white; text-align: center`}>보내기</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={css`
                      flex-direction: row;
                      align-items: center;
                      justify-content: center;
                      margin-bottom: 20px;
                    `}>
                    <TextInput
                      placeholder="인증번호 입력"
                      placeholderTextColor="black"
                      style={css`
                        border-bottom-width: 1px;
                        border-color: gray;
                        opacity: 0.5;
                        width: 100px;
                        height: 45px;
                        padding-left: 10px;
                        margin-bottom: 10px;
                        margin-right: 20px;
                      `}
                      value={forgetPassword.code}
                      onChange={onChangeFindCode}
                    />
                    <TouchableOpacity
                      style={css`
                        background-color: #5e5e5e;
                        border-radius: 5px;
                        padding: 12px 4px;
                        width: 66px;
                      `}
                      onPress={onConfirmAuthEmail}
                      >
                      <Text style={css`color: white; text-align: center`}>인증하기</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            trigger();
            onSubmitLogin();
          }}>
          <Text style={css`color: white; text-align: center`}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RegisterContainer')}>
          <Text style={css`color: white; text-align: center`}>회원가입</Text>
        </TouchableOpacity>

        <View style={css`align-self: flex-end; margin-top: 10px; margin-right: 80px`}>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={css`color: #639fff`}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  input: {
    width: 200,
    borderWidth: 0.5,
    height: 40,
    padding: 10,
    marginBottom: 5,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#ec5990',
    borderRadius: 10,
    width: 200,
    paddingVertical: 12,
    borderRadius: 4,
    opacity: 0.8,
    marginVertical: 5,
  },
  textArea: {
    width: 200,
    borderWidth: 0.5,
    height: 100,
    padding: 10,
    marginBottom: 5,
    borderRadius: 4,
  },
});
