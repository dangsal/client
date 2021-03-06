import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as authAPI from '../../../lib/api';
import {css} from '@emotion/native';

const InvitationScreen = ({route}) => {
  const [userNickname, setUserNickname] = useState();
  const [userId, setUserId] = useState(0);
  const [teamId, setTeamIds] = useState();
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    age: '',
    gender: '',
  });

  useEffect(() => {
    setTeamIds(JSON.stringify(route.params.teamId));
  }, []);

  useEffect(() => {
    console.log("userId", userId);
  }, [userId]);

  const onSearchUserByNickname = async () => {
    try {
      const response = await authAPI.searchUserByNickname(userNickname, {
        headers: {
          'Authorization': await AsyncStorage.getItem('authorization'),
        },
      });
      if(!response.data.length){
        Alert.alert('검색결과', `해당 키워드를 포함한 사용자를 찾을 수 없습니다.`, [
          {
            text: '확인',
          },
        ]);
        return;
      }
      setUserInfo(response.data[0]);
      setUserId(response.data[0].id);
    } catch (error) {
      console.log({error});
      if (error.response.status === 404) {
        Alert.alert('검색결과', `${error.response.data.message}`, [
          {
            text: '확인',
          },
        ]);
      }
    }
  };

  const onInviteTeam = async () => {
    try {
      const response = await authAPI.inviteTeam({userId}, {
        headers: {
          'Authorization': await AsyncStorage.getItem('authorization'),
          'Content-Type': 'application/json',
        },
      });
      console.log("초대 res", response)
      if (response.status === 201) {
        Alert.alert(
          '완료',
          `${userInfo.nickname}님께 팀 초대 메세지를 보냈습니다`,
          [
            {
              text: '확인',
            },
          ],
        );
      }
    } catch (error) {
      if (error.response.status === 404) {
        Alert.alert('에러', `${error.response.data.message}`, [
          {
            text: '확인',
          },
        ]);
      } else if (error.response.status === 403) {
        Alert.alert('에러', `${error.response.data.message}`, [
          {
            text: '확인',
          },
        ]);
      }
      console.log({error});
    }
  };

  return (
    <View style={css`flex: 1; padding-top: 100px; padding-horizontal: 20px`}>
      <View style={css`margin-bottom: 30px`}>
        <Text style={css`font-size: 32px`}> 멤버 초대하기</Text>
      </View>
      <View
        style={css`
          flex-direction: row;
          justify-content: center;
          margin-bottom: 40px;
        `}>
        <TextInput
          placeholder="초대할 멤버의 닉네임 입력"
          onChangeText={(text) => setUserNickname(text)}
          style={css`
            margin-right: 15px;
            padding-left: 15px;
            width: 200px;
            height: 40px;
            border-width: 1px;
            border-radius: 5px;
            border-color: #5e5e5e;
          `}
        />
        <TouchableOpacity
          onPress={onSearchUserByNickname}
          style={css`
            background-color: #5e5e5e;
            border-radius: 5px;
            padding: 11px 18px;
            width: 61px;
          `}>
          <Text style={css`color: #fff; font-weight: 500`}>검색</Text>
        </TouchableOpacity>
      </View>

      <View style={css`border-bottom-width: 1px; margin-bottom: 20px`} />
      <Text style={css`font-size: 20px; margin-bottom: 15px`}>검색결과</Text>

      {userInfo.hasOwnProperty('id') ? (
        <View
          style={css`
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px;
            margin-bottom: 5px;
            padding: 10px;
            background-color: #e5e5e5;
          `}>
          <Text style={css`font-size: 16px; margin-right: 15px`}>
            {userInfo.nickname} {userInfo.age}
            {' / '}
            {userInfo.gender === 'MALE' ? '남' : '여'}
          </Text>
          <TouchableOpacity
            onPress={onInviteTeam}
            style={css`
              background-color: #5e5e5e;
              border-radius: 5px;
              padding: 10px 15px;
              width: 56px;
            `}>
            <Text style={css`color: #fff; font-weight: 500`}>초대</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default InvitationScreen;
