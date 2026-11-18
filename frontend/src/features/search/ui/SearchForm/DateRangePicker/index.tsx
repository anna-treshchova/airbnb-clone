import { useUIStore, selectIsMobile, selectUIActions } from '@/shared/model/uiStore';
import { RangePicker, type RangePickerProps } from '@/shared/ui/RangePicker';

import type { DateStringRange } from '@/entities/search';

import type { FormActions } from '../../../model';

import {
    disablePastDate,
    toDayjsDates,
    toDayjsStrings
} from './dates.utils';

type OnRangeChange = NonNullable<RangePickerProps['onChange']>;
type OnRangeOpenChange = NonNullable<RangePickerProps['onOpenChange']>;

interface DateRangePickerProps {
    dates: DateStringRange;
    handleChange: FormActions['setFields']
}

export const DateRangePicker = ({ dates, handleChange }: DateRangePickerProps) => {
    const isMobile = useUIStore(selectIsMobile);
    const { setHeaderOverlay } = useUIStore(selectUIActions);

    const dayjsDates = toDayjsDates(dates);

    const onChange: OnRangeChange = (pickerDates) => {
        if (!pickerDates) {
            handleChange('dates', [null, null]);
            return;
        }

        const stringDates = toDayjsStrings(pickerDates);
        handleChange('dates', stringDates);
    }

    const onOpenChange: OnRangeOpenChange = (open) => {
        if (isMobile) setHeaderOverlay(open)
    }

    return (
        <RangePicker
            value={dayjsDates}
            placeholder={['Check in', 'Check out']}

            isMobile={isMobile}
            disabledDate={disablePastDate}

            onChange={onChange}
            onOpenChange={onOpenChange}
        />
    )
}