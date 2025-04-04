import React, { useEffect, useState } from 'react';
import styles from './ModalForm.module.css';
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Box pos='relative' className={styles.formContainer}>
          <LoadingOverlay 
            visible={visible} 
            loaderProps={{ children: message }} 
            className={styles.loadingOverlay}
          />
          <div className={styles.modalHeader}>
            <h2 className={styles.updateTitle}>עדכון תור</h2>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label="Close"
            >
              &#10005;
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span>שם מלא</span>
                <input
                  type='text'
                  name='clientName'
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  dir='rtl'
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span>נייד</span>
                <input
                  type='tel'
                  name='clientPhone'
                  value={formData.clientPhone}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span>תאריך</span>
                <input
                  name='date'
                  type='date'
                  value={new Date(formData.date).toISOString().split('T')[0]}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span>שעת התור</span>
                <select
                  name='hour'
                  onChange={handleChange}
                  className={styles.select}
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
              </label>
            </div>
            
            {error && (
              <p className={styles.errorMessage}>
                {error}
              </p>
            )}

            <div className={styles.actions}>
              <button type='submit' className={styles.saveButton}>שמור</button>
              <button type='button' onClick={onClose} className={styles.cancelButton}>
                ביטול
              </button>
            </div>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default ModalForm;