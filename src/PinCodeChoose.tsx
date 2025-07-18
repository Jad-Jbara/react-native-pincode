import PinCode, { PinStatus } from './PinCode'
import { noBiometricsConfig } from './utils'

import * as React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Choose PIN Page
 */

export interface IProps {
  alphabetCharsVisible?: boolean
  buttonDeleteComponent: any
  buttonDeleteText?: string
  buttonNumberComponent: any
  colorCircleButtons?: string
  colorPassword?: string
  colorPasswordEmpty?: string
  colorPasswordError?: string
  customBackSpaceIcon?: any
  emptyColumnComponent: any
  finishProcess?: (pinCode: string) => void
  getCurrentLength?: (length: number) => void
  iconButtonDeleteDisabled?: boolean
  numbersButtonOverlayColor?: string
  passwordComponent: any
  passwordLength?: number
  pinCodeKeychainName: string
  pinCodeVisible?: boolean
  storePin: any
  styleAlphabet?: StyleProp<TextStyle>
  styleButtonCircle?: StyleProp<ViewStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
  styleColorSubtitle?: string
  styleColorSubtitleError?: string
  styleColorTitle?: string
  styleColorTitleError?: string
  styleColumnButtons?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleContainer: StyleProp<ViewStyle>
  styleContainerPinCode?: StyleProp<ViewStyle>
  styleDeleteButtonColorHideUnderlay?: string
  styleDeleteButtonColorShowUnderlay?: string
  styleDeleteButtonIcon?: string
  styleDeleteButtonSize?: number
  styleDeleteButtonText?: StyleProp<TextStyle>
  styleEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeCircle?: StyleProp<ViewStyle>
  styleRowButtons?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  subtitleChoose: string
  subtitleComponent: any
  subtitleConfirm: string
  subtitleError?: string
  textPasswordVisibleFamily?: string
  textPasswordVisibleSize?: number
  titleAttemptFailed?: string
  titleChoose: string
  titleComponent: any
  titleConfirm: string
  titleConfirmFailed?: string
  titleValidationFailed?: string
  validationRegex?: RegExp
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number
}

const { useState, useCallback } = React;

const PinCodeChoose = (props: IProps) => {
  const [status, setStatus] = useState<PinStatus>(PinStatus.choose);
  const [pinCode, setPinCode] = useState<string>("");

  const endProcessCreation = useCallback((pinCodeValue: string, isErrorValidation?: boolean) => {
    setPinCode(isErrorValidation ? '' : pinCodeValue);
    setStatus(isErrorValidation ? PinStatus.choose : PinStatus.confirm);
  }, []);

  const endProcessConfirm = useCallback(async (pinCodeValue: string) => {
    if (pinCodeValue === pinCode) {
      if (props.storePin) {
        props.storePin(pinCodeValue);
      } else {
        await Keychain.setInternetCredentials(
          props.pinCodeKeychainName,
          props.pinCodeKeychainName,
          pinCodeValue,
          noBiometricsConfig
        );
      }
      if (!!props.finishProcess) props.finishProcess(pinCodeValue);
    } else {
      setStatus(PinStatus.choose);
    }
  }, [pinCode, props]);

  const cancelConfirm = useCallback(() => {
    setStatus(PinStatus.choose);
  }, []);

  return (
    <View
      style={[
        styles.container,
        props.styleContainer
      ]}>
      {status === PinStatus.choose && (
        <PinCode
          alphabetCharsVisible={props.alphabetCharsVisible}
          buttonDeleteComponent={props.buttonDeleteComponent || null}
          buttonDeleteText={props.buttonDeleteText}
          buttonNumberComponent={props.buttonNumberComponent || null}
          colorCircleButtons={props.colorCircleButtons}
          colorPassword={props.colorPassword || undefined}
          colorPasswordEmpty={props.colorPasswordEmpty}
          colorPasswordError={props.colorPasswordError || undefined}
          customBackSpaceIcon={props.customBackSpaceIcon}
          emptyColumnComponent={props.emptyColumnComponent}
          endProcess={endProcessCreation}
          getCurrentLength={props.getCurrentLength}
          iconButtonDeleteDisabled={props.iconButtonDeleteDisabled}
          numbersButtonOverlayColor={props.numbersButtonOverlayColor || undefined}
          passwordComponent={props.passwordComponent || null}
          passwordLength={props.passwordLength || 4}
          pinCodeVisible={props.pinCodeVisible}
          sentenceTitle={props.titleChoose}
          status={PinStatus.choose}
          styleAlphabet={props.styleAlphabet}
          styleButtonCircle={props.styleButtonCircle}
          styleCircleHiddenPassword={props.styleCircleHiddenPassword}
          styleCircleSizeEmpty={props.styleCircleSizeEmpty}
          styleCircleSizeFull={props.styleCircleSizeFull}
          styleColorButtonTitle={props.styleColorButtonTitle}
          styleColorButtonTitleSelected={props.styleColorButtonTitleSelected}
          styleColorSubtitle={props.styleColorSubtitle}
          styleColorSubtitleError={props.styleColorSubtitleError}
          styleColorTitle={props.styleColorTitle}
          styleColorTitleError={props.styleColorTitleError}
          styleColumnButtons={props.styleColumnButtons}
          styleColumnDeleteButton={props.styleColumnDeleteButton}
          styleContainer={props.styleContainerPinCode}
          styleDeleteButtonColorHideUnderlay={props.styleDeleteButtonColorHideUnderlay}
          styleDeleteButtonColorShowUnderlay={props.styleDeleteButtonColorShowUnderlay}
          styleDeleteButtonIcon={props.styleDeleteButtonIcon}
          styleDeleteButtonSize={props.styleDeleteButtonSize}
          styleDeleteButtonText={props.styleDeleteButtonText}
          styleEmptyColumn={props.styleEmptyColumn}
          stylePinCodeCircle={props.stylePinCodeCircle}
          styleRowButtons={props.styleRowButtons}
          styleTextButton={props.styleTextButton}
          styleTextSubtitle={props.styleTextSubtitle}
          styleTextTitle={props.styleTextTitle}
          styleViewTitle={props.styleViewTitle}
          subtitle={props.subtitleChoose}
          subtitleComponent={props.subtitleComponent || null}
          subtitleError={props.subtitleError || 'Please try again'}
          textPasswordVisibleFamily={props.textPasswordVisibleFamily}
          textPasswordVisibleSize={props.textPasswordVisibleSize}
          titleComponent={props.titleComponent || null}
          titleValidationFailed={props.titleValidationFailed || 'PIN code unsafe'}
          validationRegex={props.validationRegex}
          vibrationEnabled={props.vibrationEnabled}
        />
      )}
      {status === PinStatus.confirm && (
        <PinCode
          alphabetCharsVisible={props.alphabetCharsVisible}
          buttonDeleteComponent={props.buttonDeleteComponent || null}
          buttonDeleteText={props.buttonDeleteText}
          buttonNumberComponent={props.buttonNumberComponent || null}
          cancelFunction={cancelConfirm}
          colorCircleButtons={props.colorCircleButtons}
          colorPassword={props.colorPassword || undefined}
          colorPasswordEmpty={props.colorPasswordEmpty}
          colorPasswordError={props.colorPasswordError || undefined}
          customBackSpaceIcon={props.customBackSpaceIcon}
          emptyColumnComponent={props.emptyColumnComponent}
          endProcess={endProcessConfirm}
          getCurrentLength={props.getCurrentLength}
          iconButtonDeleteDisabled={props.iconButtonDeleteDisabled}
          numbersButtonOverlayColor={props.numbersButtonOverlayColor || undefined}
          passwordComponent={props.passwordComponent || null}
          passwordLength={props.passwordLength || 4}
          pinCodeVisible={props.pinCodeVisible}
          previousPin={pinCode}
          sentenceTitle={props.titleConfirm}
          status={PinStatus.confirm}
          subtitle={props.subtitleConfirm}
          subtitleComponent={props.subtitleComponent || null}
          subtitleError={props.subtitleError || 'Please try again'}
          textPasswordVisibleFamily={props.textPasswordVisibleFamily}
          textPasswordVisibleSize={props.textPasswordVisibleSize}
          titleAttemptFailed={props.titleAttemptFailed || 'Incorrect PIN Code'}
          titleComponent={props.titleComponent || null}
          titleConfirmFailed={props.titleConfirmFailed || 'Your entries did not match'}
          styleAlphabet={props.styleAlphabet}
          styleButtonCircle={props.styleButtonCircle}
          styleCircleHiddenPassword={props.styleCircleHiddenPassword}
          styleCircleSizeEmpty={props.styleCircleSizeEmpty}
          styleCircleSizeFull={props.styleCircleSizeFull}
          styleColorButtonTitle={props.styleColorButtonTitle}
          styleColorButtonTitleSelected={props.styleColorButtonTitleSelected}
          styleColorSubtitle={props.styleColorSubtitle}
          styleColorSubtitleError={props.styleColorSubtitleError}
          styleColorTitle={props.styleColorTitle}
          styleColorTitleError={props.styleColorTitleError}
          styleColumnButtons={props.styleColumnButtons}
          styleColumnDeleteButton={props.styleColumnDeleteButton}
          styleContainer={props.styleContainerPinCode}
          styleDeleteButtonColorHideUnderlay={props.styleDeleteButtonColorHideUnderlay}
          styleDeleteButtonColorShowUnderlay={props.styleDeleteButtonColorShowUnderlay}
          styleDeleteButtonIcon={props.styleDeleteButtonIcon}
          styleDeleteButtonSize={props.styleDeleteButtonSize}
          styleDeleteButtonText={props.styleDeleteButtonText}
          styleEmptyColumn={props.styleEmptyColumn}
          stylePinCodeCircle={props.stylePinCodeCircle}
          styleRowButtons={props.styleRowButtons}
          styleTextButton={props.styleTextButton}
          styleTextSubtitle={props.styleTextSubtitle}
          styleTextTitle={props.styleTextTitle}
          styleViewTitle={props.styleViewTitle}
          vibrationEnabled={props.vibrationEnabled}
          delayBetweenAttempts={props.delayBetweenAttempts}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default PinCodeChoose
