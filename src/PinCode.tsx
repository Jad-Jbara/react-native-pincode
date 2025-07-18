import delay from "./delay";
import { colors } from "./design/colors";
import { grid } from "./design/grid";

import { easeLinear } from "d3-ease";
import * as _ from "lodash";
import * as React from "react";
import Animate from "react-move/Animate";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  Vibration,
  View,
  ViewStyle
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * Pin Code Component
 */

export interface IProps {
  alphabetCharsVisible?: boolean
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  cancelFunction?: () => void
  colorCircleButtons?: string
  colorPassword: string
  colorPasswordEmpty?: string
  colorPasswordError: string
  customBackSpaceIcon?: Function
  emptyColumnComponent: any
  endProcess: (pinCode: string, isErrorValidation?: boolean) => void
  launchTouchID?: () => void 
  getCurrentLength?: (length: number) => void
  iconButtonDeleteDisabled?: boolean
  numbersButtonOverlayColor: string
  passwordComponent?: any
  passwordLength: number
  pinCodeStatus?: "initial" | "success" | "failure" | "locked"
  pinCodeVisible?: boolean
  previousPin?: string
  sentenceTitle: string
  status: PinStatus
  styleAlphabet?: StyleProp<TextStyle>
  styleButtonCircle?: StyleProp<ViewStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
  styleColorSubtitle: string
  styleColorSubtitleError: string
  styleColorTitle: string
  styleColorTitleError: string
  styleColumnButtons?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleContainer?: StyleProp<ViewStyle>
  styleDeleteButtonColorHideUnderlay: string
  styleDeleteButtonColorShowUnderlay: string
  styleDeleteButtonIcon: string
  styleDeleteButtonSize: number
  styleDeleteButtonText?: StyleProp<TextStyle>
  styleEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeCircle?: StyleProp<ViewStyle>
  styleRowButtons?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  subtitle: string
  subtitleComponent?: any
  subtitleError: string
  textPasswordVisibleFamily: string
  textPasswordVisibleSize: number
  titleAttemptFailed?: string
  titleComponent?: any
  titleConfirmFailed?: string
  titleValidationFailed?: string
  validationRegex?: RegExp
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number;
}

export interface IState {
  password: string
  moveData: { x: number; y: number }
  showError?: boolean
  textButtonSelected: string
  colorDelete: string
  attemptFailed?: boolean
  changeScreen?: boolean
}

export enum PinStatus {
  choose = "choose",
  confirm = "confirm",
  enter = "enter"
}

const { useState, useEffect } = React;

const PinCode = (props: IProps) => {
  const [password, setPassword] = useState<string>("");
  const [moveData, setMoveData] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showErrorState, setShowErrorState] = useState<boolean>(false);
  const [textButtonSelected, setTextButtonSelected] = useState<string>("");
  const [colorDelete, setColorDelete] = useState<string>(props.styleDeleteButtonColorHideUnderlay);
  const [attemptFailedState, setAttemptFailedState] = useState<boolean>(false);
  const [changeScreenState, setChangeScreenState] = useState<boolean>(false);

  const _circleSizeEmpty = props.styleCircleSizeEmpty || 4;
  const _circleSizeFull = props.styleCircleSizeFull || (props.pinCodeVisible ? 6 : 8);

  useEffect(() => {
    if (props.getCurrentLength) props.getCurrentLength(0);
  }, []);

  useEffect(() => {
    if (props.pinCodeStatus === "failure") {
      failedAttempt();
    }
    if (props.pinCodeStatus === "locked") {
      setPassword("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pinCodeStatus]);

  const failedAttempt = async () => {
    await delay(300);
    setShowErrorState(true);
    setAttemptFailedState(true);
    setChangeScreenState(false);
    await doShake();
    await delay(props.delayBetweenAttempts);
    await newAttempt();
  };

  const newAttempt = async () => {
    setChangeScreenState(true);
    await delay(200);
    setChangeScreenState(false);
    setShowErrorState(false);
    setAttemptFailedState(false);
    setPassword("");
  };

  const onPressButtonNumber = async (text: string) => {
    const currentPassword = password + text;
    setPassword(currentPassword);
    if (props.getCurrentLength) props.getCurrentLength(currentPassword.length);
    if (currentPassword.length === props.passwordLength) {
      switch (props.status) {
        case PinStatus.choose:
          if (props.validationRegex && props.validationRegex.test(currentPassword)) {
            showErrorFunc(true);
          } else {
            endProcess(currentPassword);
          }
          break;
        case PinStatus.confirm:
          if (currentPassword !== props.previousPin) {
            showErrorFunc();
          } else {
            endProcess(currentPassword);
          }
          break;
        case PinStatus.enter:
          props.endProcess(currentPassword);
          await delay(300);
          break;
        default:
          break;
      }
    }
  };

  const endProcess = (pwd: string) => {
    setTimeout(() => {
      setChangeScreenState(true);
      setTimeout(() => {
        props.endProcess(pwd);
      }, 500);
    }, 400);
  };

  const doShake = async () => {
    const duration = 70;
    if (props.vibrationEnabled) Vibration.vibrate(500, false);
    const length = Dimensions.get("window").width / 3;
    await delay(duration);
    setMoveData({ x: length, y: 0 });
    await delay(duration);
    setMoveData({ x: -length, y: 0 });
    await delay(duration);
    setMoveData({ x: length / 2, y: 0 });
    await delay(duration);
    setMoveData({ x: -length / 2, y: 0 });
    await delay(duration);
    setMoveData({ x: length / 4, y: 0 });
    await delay(duration);
    setMoveData({ x: -length / 4, y: 0 });
    await delay(duration);
    setMoveData({ x: 0, y: 0 });
    if (props.getCurrentLength) props.getCurrentLength(0);
  };

  const showErrorFunc = async (isErrorValidation = false) => {
    setChangeScreenState(true);
    await delay(300);
    setShowErrorState(true);
    setChangeScreenState(false);
    await doShake();
    await delay(3000);
    setChangeScreenState(true);
    await delay(200);
    setShowErrorState(false);
    setPassword("");
    await delay(200);
    props.endProcess(password, isErrorValidation);
    if (isErrorValidation) setChangeScreenState(false);
  };

  const renderButtonNumber = (text: string) => {
    let alphanumericMap = new Map([
      ["1", " "],
      ["2", "ABC"],
      ["3", "DEF"],
      ["4", "GHI"],
      ["5", "JKL"],
      ["6", "MNO"],
      ["7", "PQRS"],
      ["8", "TUV"],
      ["9", "WXYZ"],
      ["0", " "]
    ]);
    const disabled =
      (password.length === props.passwordLength || showErrorState) && !attemptFailedState;
    return (
      <Animate
        show={true}
        start={{ opacity: 1 }}
        update={{
          opacity: [showErrorState && !attemptFailedState ? 0.5 : 1],
          timing: { duration: 200, ease: easeLinear }
        }}>
        {({ opacity }: any) => (
          <TouchableHighlight
            style={[
              styles.buttonCircle,
              { backgroundColor: props.colorCircleButtons },
              props.styleButtonCircle,
            ]}
            underlayColor={props.numbersButtonOverlayColor}
            disabled={disabled}
            onShowUnderlay={() => setTextButtonSelected(text)}
            onHideUnderlay={() => setTextButtonSelected("")}
            onPress={() => {
              onPressButtonNumber(text);
            }}
            accessible
            accessibilityLabel={text}>
            <View>
              <Text
                style={[
                  styles.text,
                  props.styleTextButton,
                  {
                    opacity: opacity,
                    color: textButtonSelected === text
                      ? props.styleColorButtonTitleSelected
                      : props.styleColorButtonTitle
                  }
                ]}>
                {text}
              </Text>
              {(props.alphabetCharsVisible) &&
                <Text
                  style={[
                    styles.tinytext,
                    props.styleAlphabet,
                    {
                      opacity: opacity,
                      color: textButtonSelected === text
                        ? props.styleColorButtonTitleSelected
                        : props.styleColorButtonTitle
                    }
                  ]}>
                  {alphanumericMap.get(text)}
                </Text>
              }
            </View>
          </TouchableHighlight>
        )}
      </Animate>
    );
  };

  const renderCirclePassword = () => {
    const colorPwdErr = props.colorPasswordError;
    const colorPwd = props.colorPassword;
    const colorPwdEmp = props.colorPasswordEmpty || colorPwd;
    return (
      <View
        style={[styles.topViewCirclePassword, props.styleCircleHiddenPassword]}>
        {_.range(props.passwordLength).map((val: number) => {
          const lengthSup =
            ((password.length >= val + 1 && !changeScreenState) || showErrorState) &&
            !attemptFailedState;
          return (
            <Animate
              key={val}
              show={true}
              start={{
                opacity: 0.5,
                height: _circleSizeEmpty,
                width: _circleSizeEmpty,
                borderRadius: _circleSizeEmpty / 2,
                color: colorPwdEmp,
                marginRight: 10,
                marginLeft: 10,
                x: 0,
                y: 0
              }}
              update={{
                x: [moveData.x],
                opacity: [lengthSup ? 1 : 0.5],
                height: [
                  lengthSup ? _circleSizeFull : _circleSizeEmpty
                ],
                width: [
                  lengthSup ? _circleSizeFull : _circleSizeEmpty
                ],
                color: [
                  showErrorState
                    ? colorPwdErr
                    : (lengthSup && password.length > 0)
                      ? colorPwd
                      : colorPwdEmp
                ],
                borderRadius: [
                  lengthSup
                    ? _circleSizeFull / 2
                    : _circleSizeEmpty / 2
                ],
                marginRight: [
                  lengthSup
                    ? 10 - (_circleSizeFull - _circleSizeEmpty) / 2
                    : 10
                ],
                marginLeft: [
                  lengthSup
                    ? 10 - (_circleSizeFull - _circleSizeEmpty) / 2
                    : 10
                ],
                y: [moveData.y],
                timing: { duration: 200, ease: easeLinear }
              }}>
              {({
                opacity,
                x,
                height,
                width,
                color,
                borderRadius,
                marginRight,
                marginLeft
              }: any) => (
                  <View style={styles.viewCircles}>
                    {((!props.pinCodeVisible ||
                      (props.pinCodeVisible && !lengthSup)) && (
                        <View
                          style={[{
                            left: x,
                            height: height,
                            width: width,
                            opacity: opacity,
                            borderRadius: borderRadius,
                            marginLeft: marginLeft,
                            marginRight: marginRight,
                            backgroundColor: color
                          }, props.stylePinCodeCircle]}
                        />
                      )) || (
                        <View
                          style={{
                            left: x,
                            opacity: opacity,
                            marginLeft: marginLeft,
                            marginRight: marginRight
                          }}>
                          <Text
                            style={{
                              color: color,
                              fontFamily: props.textPasswordVisibleFamily,
                              fontSize: props.textPasswordVisibleSize
                            }}>
                            {password[val]}
                          </Text>
                        </View>
                      )}
                  </View>
                )}
            </Animate>
          );
        })}
      </View>
    );
  };

  const renderButtonDelete = (opacity: number) => {
    return (
      <TouchableHighlight
        activeOpacity={1}
        disabled={password.length === 0}
        underlayColor="transparent"
        onHideUnderlay={() =>
          setColorDelete(props.styleDeleteButtonColorHideUnderlay)
        }
        onShowUnderlay={() =>
          setColorDelete(props.styleDeleteButtonColorShowUnderlay)
        }
        onPress={() => {
          if (password.length > 0) {
            const newPass = password.slice(0, -1);
            setPassword(newPass);
            if (props.getCurrentLength)
              props.getCurrentLength(newPass.length);
          }
        }}
        accessible
        accessibilityLabel={props.buttonDeleteText}>
        <View
          style={[styles.colIcon, props.styleColumnDeleteButton]}>
          {props.customBackSpaceIcon ?
            props.customBackSpaceIcon({ colorDelete: colorDelete, opacity })
            :
            <>
              {!props.iconButtonDeleteDisabled && (
                <Icon
                  name={props.styleDeleteButtonIcon}
                  size={props.styleDeleteButtonSize}
                  color={colorDelete}
                  style={{ opacity: opacity }}
                />
              )}
              <Text
                style={[
                  styles.textDeleteButton,
                  props.styleDeleteButtonText,
                  { color: colorDelete, opacity: opacity }
                ]}>
                {props.buttonDeleteText}
              </Text>
            </>
          }
        </View>
      </TouchableHighlight>
    );
  };

  const renderTitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed?: boolean,
    showError?: boolean
  ) => {
    return (
      <Text
        style={[
          styles.textTitle,
          props.styleTextTitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {(attemptFailed && props.titleAttemptFailed) ||
          (showError && props.titleConfirmFailed) ||
          (showError && props.titleValidationFailed) ||
          props.sentenceTitle}
      </Text>
    );
  };

  const renderSubtitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed?: boolean,
    showError?: boolean
  ) => {
    return (
      <Text
        style={[
          styles.textSubtitle,
          props.styleTextSubtitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {attemptFailed || showError
          ? props.subtitleError
          : props.subtitle}
      </Text>
    );
  };

  const { showError, attemptFailed, changeScreen } = { ...props };
  return (
    <View
      style={[
        styles.container,
        props.styleContainer
      ]}>
      <Animate
        show={true}
        start={{
          opacity: 0,
          colorTitle: props.styleColorTitle,
          colorSubtitle: props.styleColorSubtitle,
          opacityTitle: 1
        }}
        enter={{
          opacity: [1],
          colorTitle: [
            props.styleColorTitle
          ],
          colorSubtitle: [
            props.styleColorSubtitle
          ],
          opacityTitle: [1],
          timing: { duration: 200, ease: easeLinear }
        }}
        update={{
          opacity: [changeScreen ? 0 : 1],
          colorTitle: [
            showError || attemptFailed
              ? props.styleColorTitleError
              : props.styleColorTitle
          ],
          colorSubtitle: [
            showError || attemptFailed
              ? props.styleColorSubtitleError
              : props.styleColorSubtitle
          ],
          opacityTitle: [showError || attemptFailed ? grid.highOpacity : 1],
          timing: { duration: 200, ease: easeLinear }
        }}>
        {({ opacity, colorTitle, colorSubtitle, opacityTitle }: any) => (
          <View
            style={[
              styles.viewTitle,
              props.styleViewTitle,
              { opacity: opacity }
            ]}>
            {props.titleComponent
              ? props.titleComponent()
              : renderTitle(
                colorTitle,
                opacityTitle,
                attemptFailed,
                showError
              )}
            {props.subtitleComponent
              ? props.subtitleComponent()
              : renderSubtitle(
                colorSubtitle,
                opacityTitle,
                attemptFailed,
                showError
              )}
          </View>
        )}
      </Animate>
      <View style={styles.flexCirclePassword}>
        {props.passwordComponent
          ? props.passwordComponent()
          : renderCirclePassword()}
      </View>
      <Grid style={styles.grid}>
        <Row
          style={[
            styles.row,
            props.styleRowButtons
          ]}>
          {_.range(1, 4).map((i: number) => {
            return (
              <Col
                key={i}
                style={[
                  styles.colButtonCircle,
                  props.styleColumnButtons
                ]}>
                {props.buttonNumberComponent
                  ? props.buttonNumberComponent(
                    i,
                    onPressButtonNumber
                  )
                  : renderButtonNumber(i.toString())}
              </Col>
            );
          })}
        </Row>
        <Row
          style={[
            styles.row,
            props.styleRowButtons
          ]}>
          {_.range(4, 7).map((i: number) => {
            return (
              <Col
                key={i}
                style={[
                  styles.colButtonCircle,
                  props.styleColumnButtons
                ]}>
                {props.buttonNumberComponent
                  ? props.buttonNumberComponent(
                    i,
                    onPressButtonNumber
                  )
                  : renderButtonNumber(i.toString())}
              </Col>
            );
          })}
        </Row>
        <Row
          style={[
            styles.row,
            props.styleRowButtons
          ]}>
          {_.range(7, 10).map((i: number) => {
            return (
              <Col
                key={i}
                style={[
                  styles.colButtonCircle,
                  props.styleColumnButtons
                ]}>
                {props.buttonNumberComponent
                  ? props.buttonNumberComponent(
                    i,
                    onPressButtonNumber
                  )
                  : renderButtonNumber(i.toString())}
              </Col>
            );
          })}
        </Row>
        <Row
          style={[
            styles.row,
            styles.rowWithEmpty,
            props.styleRowButtons
          ]}>
          <Col
            style={[
              styles.colEmpty,
              props.styleEmptyColumn
            ]}>
            {props.emptyColumnComponent 
              ? props.emptyColumnComponent(props.launchTouchID)
              : null
            }
          </Col>
          <Col
            style={[
              styles.colButtonCircle,
              props.styleColumnButtons
            ]}>
            {props.buttonNumberComponent
              ? props.buttonNumberComponent(
                "0",
                onPressButtonNumber
              )
              : renderButtonNumber("0")}
          </Col>
          <Col
            style={[
              styles.colButtonCircle,
              props.styleColumnButtons
            ]}>
            <Animate
              show={true}
              start={{
                opacity: 0.5
              }}
              update={{
                opacity: [
                  password.length === 0 ||
                    password.length === props.passwordLength
                    ? 0.5
                    : 1
                ],
                timing: { duration: 400, ease: easeLinear }
              }}>
              {({ opacity }: any) =>
                props.buttonDeleteComponent
                  ? props.buttonDeleteComponent(() => {
                    if (password.length > 0) {
                      const newPass = password.slice(0, -1);
                      setPassword(newPass);
                      if (props.getCurrentLength)
                        props.getCurrentLength(newPass.length);
                    }
                  })
                  : renderButtonDelete(opacity)
              }
            </Animate>
          </Col>
        </Row>
      </Grid>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  viewTitle: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 2
  },
  row: {
    flex: 0,
    flexShrink: 1,
    alignItems: "center",
    height: grid.unit * 5.5
  },
  rowWithEmpty: {
    flexShrink: 0,
    justifyContent: 'flex-end',
  },
  colButtonCircle: {
    flex: 0,
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    alignItems: "center",
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colEmpty: {
    flex: 0,
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colIcon: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  text: {
    fontSize: grid.unit * 2,
    fontWeight: "200"
  },
  tinytext: {
    fontSize: grid.unit/2,
    fontWeight: "300"
  },
  buttonCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: grid.unit * 4,
    height: grid.unit * 4,
    backgroundColor: "rgb(242, 245, 251)",
    borderRadius: grid.unit * 2
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "200",
    lineHeight: grid.unit * 2.5
  },
  textSubtitle: {
    fontSize: grid.unit,
    fontWeight: "200",
    textAlign: "center"
  },
  flexCirclePassword: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  topViewCirclePassword: {
    flexDirection: "row",
    height: "auto",
    justifyContent: "center",
    alignItems: "center"
  },
  viewCircles: {
    justifyContent: "center",
    alignItems: "center"
  },
  textDeleteButton: {
    fontWeight: "200",
    marginTop: 5
  },
  grid: {
    justifyContent: 'flex-start',
    width: "100%",
    flex: 7
  }
});

export default PinCode;
