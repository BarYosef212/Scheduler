import React, { useEffect, useState } from 'react';
import './ModalForm.css';
import { Availability, Booking } from '../../../../../types/modelTypes';
import {
  filterAvailabilitiesHours,
  updateBooking,
} from '../../../../../services/services';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useDisclosure } from '@mantine/hooks';
import { Box, LoadingOverlay } from '@mantine/core';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentBooking: Booking;
  allTimes: Availability[];
}

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  currentBooking,
  allTimes,
}) => {
  const [formData, setFormData] = useState(currentBooking);
  const [tempTimes, setTempTimes] = useState<String[]>([]);
  const [error, setError] = useState<String>('');
  const [visible, { toggle }] = useDisclosure(false);
  const [message, setMessage] = useState<String>('...מעדכן את התור, אנא המתן');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const filtered = filterAvailabilitiesHours(allTimes, formData.date);
    filtered.push(formData.hour);
    setTempTimes(filtered);
  }, [formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { clientPhone } = formData;
    if (
      clientPhone.length > 0 &&
      !isValidPhoneNumber(clientPhone) &&
      clientPhone.length != 10
    ) {
      setError('מס טלפון לא תקין');
      return;
    }
    const confirmation = confirm('האם לעדכן את התור?');
    if (!confirmation) return;
    toggle();
    const formattedDate = new Date(formData.date);
    formattedDate.setUTCHours(0, 0, 0, 0);
    formData.date = formattedDate;
    delete formData.id;
    updateBooking(formData, currentBooking).then((responseMessage) => {
      toggle();
      setMessage(responseMessage);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <Box pos='relative'>
        <LoadingOverlay visible={visible} loaderProps={{ children: message }} />
        <h2 className='update-title-form'>עדכון תור</h2>
        <form onSubmit={handleSubmit} className='modal-form'>
          <label className='modal-label'>
            <input
              type='text'
              name='clientName'
              value={formData.clientName}
              onChange={handleChange}
              required
              className='modal-input'
              dir='rtl'
            />
            <span>:שם מלא</span>
          </label>
          <label className='modal-label'>
            <input
              type='tel'
              name='clientPhone'
              value={formData.clientPhone}
              onChange={handleChange}
              required
              className='modal-input'
            />
            <span>:נייד</span>
          </label>

          <label className='modal-label'>
            <input
              name='date'
              type='date'
              value={new Date(formData.date).toISOString().split('T')[0]}
              onChange={handleChange}
            />
            <span>:תאריך</span>
          </label>

          <label className='modal-label'>
            <select
              name='hour'
              onChange={handleChange}
              className='modal-input'
              value={formData.hour}
            >
              <option value='' disabled>
                בחר שעה
              </option>
              {tempTimes &&
                tempTimes.map((time, index) => (
                  <option key={index}>{time}</option>
                ))}
            </select>
            <span>:שעת התור</span>
          </label>
          {error && (
            <p style={{ margin: '0', color: 'red', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <div className='modal-actions'>
            <button type='submit'>שמור</button>
            <button type='button' onClick={onClose}>
              ביטול
            </button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default ModalForm;
