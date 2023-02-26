import React, { useCallback } from "react";
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  View,
  ViewStyle,
} from "react-native";

type PressableProps = {
  disabledOpacity?: number;
  activeOpacity?: number;
  noOpacityChange?: boolean;
  disabled?: boolean;
  onPress?: (event?: GestureResponderEvent) => void | Promise<void>;
} & RNPressableProps &
  React.RefAttributes<View>;

export const Pressable: React.FC<PressableProps> = ({
  style,
  disabled = false,
  disabledOpacity = 0.3,
  activeOpacity = 0.5,
  noOpacityChange = false,
  onPress,
  ...passThroughProps
}) => {
  const getOpacity = useCallback(
    (pressed: boolean) => {
      if (disabled) {
        return disabledOpacity;
      } else {
        if (pressed && !noOpacityChange) {
          return activeOpacity;
        } else {
          return 1;
        }
      }
    },
    [activeOpacity, disabled, disabledOpacity, noOpacityChange]
  );
  const opacityAddStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      style as ViewStyle,
      { opacity: getOpacity(pressed) },
    ],
    [getOpacity, style]
  );

  return (
    <RNPressable
      style={opacityAddStyle}
      disabled={disabled}
      {...passThroughProps}
      onPress={onPress}
      hitSlop={10}
    />
  );
};
