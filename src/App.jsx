import { TimePicker, Divider, Button } from 'antd';
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import './App.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { messages } from './messages';


const App = ({tg, sourceSchedule, locale, bot_id}) => {
    messages.setLanguage(locale);
    tg.MainButton.setText(messages.save);
    tg.MainButton.show();

    const [schedule, setSchedule] = useState(sourceSchedule);

    const [send, setSend] = useState(false);

    const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ]

    useEffect(() => {
        if (send) {
            tg.sendData(JSON.stringify({
                schedule: {
                    monday: schedule.monday || [],
                    tuesday: schedule.tuesday || [],
                    wednesday: schedule.wednesday || [],
                    thursday: schedule.thursday || [],
                    friday: schedule.friday || [],
                    saturday: schedule.saturday || [],
                    sunday: schedule.sunday || [],
                },
                bot_id,
                'route': 'schedule'
            }))
        };
    }, [send, schedule, tg, bot_id])

    tg.MainButton.onClick(() => {
        tg.HapticFeedback.impactOccurred("medium");
        setSend(true);
      });

    console.log(schedule)
    const format = 'HH:mm';
   return days.map(day => (
    <div key={day}>
    <Divider className={`divider ${['saturday', 'sunday'].includes(day) ? 'weekday': ''}`} orientation="left" plain>{messages[day]}</Divider>
    <div className='schedule'>
    {(schedule[day] || []).map(range => {
        let index = schedule[day].indexOf(range)

        const getDisabledTime = () => {
            let disabledHours = [];
            let previousTo = null;


            if (index > 0) {
                previousTo = dayjs(schedule[day][index - 1].to, format)

                disabledHours = [...Array(previousTo.$H).keys()]
            }
            return {
                disabledHours: () => disabledHours,
                disabledMinutes: (selectedHour) => previousTo?.$H === selectedHour && previousTo.$m !== 0 ? [...Array(previousTo.$m).keys()] : [],
                disabledSeconds: (selectedHour, selectedMinute) => []
            }
        };
        return (
        <TimePicker.RangePicker 
            key={schedule[day].indexOf(range)} 
            className={`picker`}
            format={format}
            minuteStep={15}
            inputReadOnly
            size='large'
            popupClassName='popup'
            allowClear={index + 1 === schedule[day].length ? {clearIcon: <CloseCircleFilled  className='clearBtnHover'/>} : false}
            bordered={true}
            suffixIcon={index + 1 === schedule[day].length ? <CloseCircleFilled  className='clearBtn'/> : <CloseCircleFilled  className='clearBtnHidden'/>}

            changeOnBlur={true}
            placeholder={[messages.startTime, messages.endTime]}
            defaultValue={range.from ? [dayjs(range.from, format), dayjs(range.to, format)] : null}
            disabledTime={getDisabledTime}
            onChange={props => {
                if (props) {
                    schedule[day][index].from = `${props[0].$H === 0 ? '00' : props[0].$H}:${props[0].$m === 0 ? '00': props[0].$m}`
                    schedule[day][index].to = `${props[1].$H === 0 ? '00' : props[1].$H}:${props[1].$m === 0 ? '00': props[1].$m}`
                    setSchedule({...schedule})

                }
                else {
                    schedule[day] = schedule[day].filter(item => item !== range)
                    setSchedule({...schedule, [day]: schedule[day].filter(item => item !== range)})
                }
            }
            }
            />
        )})}
    {schedule[day].length < 4 && <Button 
        className='addBtn' 
        type="default" 
        disabled={!((schedule[day].length === 0 || !!schedule[day][schedule[day].length - 1]) && schedule[day][schedule[day].length - 1]?.to !== '23:59')}
        icon={<PlusOutlined />} 
        block
        onClick={() => {
            setSchedule({
                ...schedule,
                [day]: [
                    ...schedule[day],
                    {
                        from: schedule[day][schedule[day].length - 1]?.to || "00:00",
                        to: '23:59'
                    }
                ]
            })
        }} />
    }
    </div>
        </div>

   ))

}

export default App;
