import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTextInput = ({ 
  style, 
  containerStyle,
  wrapperStyle,
  onFocus, 
  onBlur, 
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  autoCorrect,
  placeholderTextColor = "#999",
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  label,
  error,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderInput = () => {
    if (Platform.OS === 'web') {
      // Filtrar props que não são válidas para elementos HTML
      const {
        onChangeText,
        value,
        placeholder,
        ...webProps
      } = props;

      return (
        <input
          {...webProps}
          style={{
            flex: 1,
            fontSize: 16,
            color: '#333',
            height: 55,
            width: '100%',
            padding: 5,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'System',
            cursor: 'text',
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChange={(e) => onChangeText && onChangeText(e.target.value)}
          placeholder={placeholder}
          type={
            showPasswordToggle 
              ? (isPasswordVisible ? 'text' : 'password')
              : secureTextEntry 
                ? 'password' 
                : keyboardType === 'email-address' 
                  ? 'email' 
                  : 'text'
          }
          autoCapitalize={autoCapitalize === 'none' ? 'off' : autoCapitalize}
          autoCorrect={autoCorrect ? 'on' : 'off'}
        />
      );
    }

    return (
      <TextInput
        {...props}
        style={[styles.input, style]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={keyboardType}
        secureTextEntry={
          showPasswordToggle 
            ? !isPasswordVisible 
            : secureTextEntry
        }
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        placeholderTextColor={placeholderTextColor}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError,
        wrapperStyle
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {typeof leftIcon === 'string' ? (
              <Ionicons name={leftIcon} size={20} color="#276999" />
            ) : (
              leftIcon
            )}
          </View>
        )}
        
        {renderInput()}
        
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#276999"
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIconContainer}>
            {typeof rightIcon === 'string' ? (
              <Ionicons name={rightIcon} size={20} color="#276999" />
            ) : (
              rightIcon
            )}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  labelError: {
    color: '#e74c3c',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 15,
    height: 55,
    cursor: Platform.OS === 'web' ? 'text' : 'auto',
  },
  inputWrapperFocused: {
    borderColor: '#276999',
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 2px rgba(39, 105, 153, 0.2)',
      },
    }),
  },
  inputWrapperError: {
    borderColor: '#e74c3c',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 55,
    width: '100%',
    padding: 5,
  },
  leftIconContainer: {
    marginRight: 10,
  },
  rightIconContainer: {
    padding: 5,
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 5,
    marginLeft: 5,
  },
});

export default CustomTextInput;
