import { FocusEvent, InputHTMLAttributes, useCallback } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { Flex, Input, Label, Text, ThemeUICSSObject } from 'theme-ui';

import { combineClassNames } from '../../utils';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;

  wrapperStyle?: ThemeUICSSObject;
}

export default function FormInput(props: Omit<Props, 'sx'>) {
  const { label, error, wrapperStyle, id, disabled, onFocus, onBlur, ...rest } = props;
  const [focused, setFocused] = useState(false);

  const _onFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus && onFocus(e);
    },
    [onFocus],
  );

  const _onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur && onBlur(e);
    },
    [onBlur],
  );

  const className = useMemo(() => {
    let _className = '';
    if (disabled) {
      _className = combineClassNames(_className, 'disabled');
    }
    if (!!error) {
      _className = combineClassNames(_className, 'error');
    }
    if (focused) {
      _className = combineClassNames(_className, 'focused');
    }
    return _className.trim();
  }, [disabled, error, focused]);

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex variant="styles.form-input" className={className} sx={wrapperStyle}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Input id={id} onFocus={_onFocus} onBlur={_onBlur} {...rest} />
      </Flex>
      {error && <Text sx={{ fontSize: 0, fontWeight: 'medium', color: 'error', marginTop: '4px' }}>{error}</Text>}
    </Flex>
  );
}
