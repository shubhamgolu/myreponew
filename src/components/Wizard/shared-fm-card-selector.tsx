import * as React from 'react';
import { FieldWrapper } from '@progress/kendo-react-form';
import { RadioButton } from '@progress/kendo-react-inputs';
import type { RadioButtonChangeEvent } from '@progress/kendo-react-inputs';

interface CardSelectorProps {
    value: string;
    valid?: boolean;
    onChange: (event: { value: string }) => void;
}
  
export const CardSelector = (props: CardSelectorProps) => {
    const { value, valid } = props;
    const [cardHover, setCardHover] = React.useState('');

    const onMouseEnter = React.useCallback(
        (event: React.MouseEvent<HTMLLabelElement>) => {
            const cardType = event.currentTarget.getAttribute('htmlFor');
            if (cardType) {
                setCardHover(cardType);
            } else {
                setCardHover('');
            }
        },
        [setCardHover]
    );
    // import moved to top level
    

    const onChange = React.useCallback((event: RadioButtonChangeEvent) => {
        props.onChange({ value: event.value });
    }, [props]);

    const filter: string = 'brightness(1.8) grayscale(1) opacity(.7)';
    const filterHover: string = 'brightness(1.2) grayscale(.5) opacity(.9)';
    const cardStyle: React.CSSProperties | undefined = {
        cursor: 'pointer',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'inline-block',
        width: 138,
        height: 70,
        border: '1px solid'
    };
    const visaStyle: React.CSSProperties | undefined = {
        backgroundImage: 'url(https://cdn-icons-png.flaticon.com/128/196/196578.png)',
        filter: value === 'visa' ? 'none' : cardHover === 'visa' ? filterHover : filter,
        ...cardStyle
    };
    const masterCardStyle: React.CSSProperties | undefined = {
        backgroundImage: 'url(https://cdn-icons-png.flaticon.com/128/196/196561.png)',
        filter: value === 'masterCard' ? 'none' : cardHover === 'masterCard' ? filterHover : filter,
        ...cardStyle
    };
    const paypalStyle: React.CSSProperties | undefined = {
        backgroundImage: 'url(https://cdn-icons-png.flaticon.com/128/196/196565.png)',
        filter: value === 'paypal' ? 'none' : cardHover === 'paypal' ? filterHover : filter,
        ...cardStyle
    };
    const inputStyles: React.CSSProperties | undefined = {
        visibility: 'hidden',
        position: 'absolute'
    };
 
    return (
        <FieldWrapper>
            <label className={`k-label${valid ? '' : ' k-text-error'}`}>Payment Type</label>
            <ul className="k-radio-list k-list-horizontal">
                <li className="k-radio-item">
                    <RadioButton
                        onChange={onChange}
                        checked={value === 'visa'}
                        id="visa"
                        value="visa"
                        name="paymentType"
                        style={inputStyles}
                    />
                    <label onMouseEnter={onMouseEnter} onMouseLeave={() => setCardHover('')} htmlFor="visa" style={visaStyle} />
                </li>

                <li className="k-radio-item">
                    <RadioButton
                        onChange={onChange}
                        checked={value === 'masterCard'}
                        id="masterCard"
                        value="masterCard"
                        name="paymentType"
                        style={inputStyles}
                    />
                    <label
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={() => setCardHover('')}
                        htmlFor="masterCard"
                        style={masterCardStyle}
                    />
                </li>

                <li className="k-radio-item">
                    <RadioButton
                        onChange={onChange}
                        checked={value === 'paypal'}
                        id="paypal"
                        value="paypal"
                        name="paymentType"
                        style={inputStyles}
                    />
                    <label
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={() => setCardHover('')}
                        htmlFor="paypal"
                        style={paypalStyle}
                    />
                </li>
            </ul>
        </FieldWrapper>
    );
};
