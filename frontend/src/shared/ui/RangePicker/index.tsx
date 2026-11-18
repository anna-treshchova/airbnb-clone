import { DatePicker, type GetProps } from 'antd';
import styles from './RangePicker.module.scss';

const { RangePicker: AntdRangePicker } = DatePicker;

type AntdRangePickerProps = GetProps<typeof AntdRangePicker>;

export type RangePickerProps = AntdRangePickerProps & {
    isMobile: boolean;
};

export const RangePicker = ({
    value,
    placeholder,
    size = 'middle',
    format ='DD MMM',
    disabledDate,

    isMobile,

    onChange,
    onOpenChange,
}: RangePickerProps) => {
    return (
        <AntdRangePicker
            className={styles.input}
            value={value}
            placeholder={placeholder}
            size={size}
            format={format}

            disabledDate={disabledDate}

            classNames={{
                popup: {
                    root: styles.customDatePopup,
                },
            }}
            getPopupContainer={(trigger) =>
                isMobile
                    ? document.body
                    : trigger.parentElement ?? document.body
            }

            onChange={onChange}
            onOpenChange={onOpenChange}
        />
    )
}