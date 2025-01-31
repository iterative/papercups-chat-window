/**
 * This is all copied from https://github.com/Andarist/react-textarea-autosize
 *
 * The only difference is that we use theme-ui's `Textarea` here rather than the default `textarea`
 */

import * as React from 'react';
import {Textarea} from 'theme-ui';
import calculateNodeHeight from './calculateNodeHeight';
import getSizingData, {SizingData} from './getSizingData';
import {useComposedRef, useWindowResizeListener} from './hooks';
import {noop} from './utils';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Style = Omit<
  NonNullable<TextareaProps['style']>,
  'maxHeight' | 'minHeight'
> & {
  height?: number;
};

export type TextareaHeightChangeMeta = {
  rowHeight: number;
};
export type TextareaAutosizeProps = Omit<TextareaProps, 'style'> & {
  maxRows?: number;
  minRows?: number;
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
  cacheMeasurements?: boolean;
  style?: Style;
};

const TextareaAutosize: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaAutosizeProps
> = (
  {
    cacheMeasurements,
    maxRows,
    minRows,
    onChange = noop,
    onHeightChange = noop,
    ...props
  },
  userRef: React.Ref<HTMLTextAreaElement>
) => {
  if (process.env.NODE_ENV !== 'production' && props.style) {
    if ('maxHeight' in props.style) {
      throw new Error(
        'Using `style.maxHeight` for <TextareaAutosize/> is not supported. Please use `maxRows`.'
      );
    }
    if ('minHeight' in props.style) {
      throw new Error(
        'Using `style.minHeight` for <TextareaAutosize/> is not supported. Please use `minRows`.'
      );
    }
  }
  const isControlled = props.value !== undefined;
  const libRef = React.useRef<HTMLTextAreaElement | null>(null);
  const ref = useComposedRef(libRef, userRef);
  const heightRef = React.useRef(0);
  const measurementsCacheRef = React.useRef<SizingData | null>(null);

  const resizeTextarea = () => {
    const node = libRef.current!;
    const nodeSizingData =
      cacheMeasurements && measurementsCacheRef.current
        ? measurementsCacheRef.current
        : getSizingData(node);

    if (!nodeSizingData) {
      return;
    }

    measurementsCacheRef.current = nodeSizingData;

    const [height, rowHeight] = calculateNodeHeight(
      nodeSizingData,
      node.value || node.placeholder || 'x',
      minRows,
      maxRows
    );

    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty('height', `${height}px`, 'important');
      onHeightChange(height, {rowHeight});
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      resizeTextarea();
    }
    onChange(event);
  };

  React.useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      resizeTextarea();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useWindowResizeListener(resizeTextarea);

  return <Textarea {...props} onChange={handleChange} ref={ref} />;
};

export default /* #__PURE__ */ React.forwardRef(TextareaAutosize);
