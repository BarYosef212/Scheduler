import React, { useState, useEffect } from 'react';
import styles from './Preferences.module.css';
import { Checkbox, TextInput, Button, Loader } from '@mantine/core';
import { getUser, updateUser } from '../../../services/services';
import { useValuesAdmin } from '../context/AdminContext';
import { useValuesGlobal } from '../../GlobalContext/GlobalContext';
import { useToast } from '../../hooks/useToast';

interface BarberPreferences {
  daysExcluded: number[];
  userName: string;
  title: string;
  logo: string | null;
}

const Preferences: React.FC = () => {
  const { userId } = useValuesGlobal();
  const { setStep } = useValuesAdmin();
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState<BarberPreferences>({
    daysExcluded: [],
    userName: '',
    title: '',
    logo: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const daysOfWeek = [
    { value: 0, label: 'ראשון' },
    { value: 1, label: 'שני' },
    { value: 2, label: 'שלישי' },
    { value: 3, label: 'רביעי' },
    { value: 4, label: 'חמישי' },
    { value: 5, label: 'שישי' },
    { value: 6, label: 'שבת' },
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        const user = await getUser(userId);
        if (user) {
          setPreferences({
            daysExcluded: user.daysExcluded,
            userName: user.userName,
            title: user.title || '',
            logo: user.logo || '',
          });
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError('אירעה שגיאה בטעינת ההעדפות');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchPreferences();
    }
  }, [userId]);

  const handleWorkDayChange = (day: number) => {
    setPreferences((prev) => {
      if (prev.daysExcluded.includes(day)) {
        return {
          ...prev,
          daysExcluded: prev.daysExcluded.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          daysExcluded: [...prev.daysExcluded, day],
        };
      }
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError('');
      const response = await updateUser(userId, {
        ...preferences,
        logo: preferences.logo || undefined,
      });
      setSuccess(true);
      showToast(response, 'success');
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      setError('אירעה שגיאה בשמירת ההעדפות');
      showToast(error, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeLogoPreview = () => {
    setPreferences((prev) => ({
      ...prev,
      logo: null,
    }));
  };

  return (
    <>
      {isLoading ? (
        <Loader color='var(--gold)' />
      ) : (
        <div className={styles.container}>
          <button className={styles.backButton} onClick={() => setStep(1)}>
            חזור לדף הראשי
          </button>
          <h1 className={styles.title}>הגדרות עסק</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>ימי מנוחה</h2>
              <div className={styles.workDays}>
                {daysOfWeek.map((day) => (
                  <Checkbox
                    key={day.value}
                    checked={preferences.daysExcluded.includes(day.value)}
                    onChange={() => handleWorkDayChange(day.value)}
                    label={day.label}
                    className={styles.checkbox}
                    classNames={{
                      root: styles.checkboxRoot,
                      label: styles.checkboxLabel,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>פרטי העסק</h2>

              <div className={styles.businessInfoFields}>
                <div className={styles.inputGroup}>
                  <TextInput
                    label='שם העסק'
                    name='userName'
                    value={preferences.userName}
                    onChange={handleTextChange}
                    required
                    className={styles.textInput}
                    classNames={{
                      root: styles.inputRoot,
                      label: styles.inputLabel,
                      input: styles.input,
                    }}
                    size='md'
                  />
                </div>

                <div className={styles.inputGroup}>
                  <TextInput
                    label='כותרת (תיאור קצר של העסק)'
                    name='title'
                    value={preferences.title}
                    onChange={handleTextChange}
                    className={styles.textInput}
                    classNames={{
                      root: styles.inputRoot,
                      label: styles.inputLabel,
                      input: styles.input,
                    }}
                    size='md'
                  />
                </div>
              </div>

              <div className={styles.logoSection}>
                <label className={styles.logoLabel}>לוגו העסק</label>

                <div className={styles.logoContainer}>
                  {preferences.logo || preferences.logo ? (
                    <div className={styles.logoPreviewContainer}>
                      <img
                        src={preferences.logo}
                        alt='Logo preview'
                        className={styles.logoPreview}
                      />
                      <button
                        type='button'
                        className={styles.removeLogoButton}
                        onClick={removeLogoPreview}
                        aria-label='Remove logo'
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.logoPlaceholder}>
                      <span className={styles.logoPlaceholderIcon}>🖼️</span>
                      <span className={styles.logoPlaceholderText}>
                        אין לוגו
                      </span>
                    </div>
                  )}

                  <TextInput
                    label='כתובת URL של לוגו'
                    name='logo'
                    value={preferences.logo || ''}
                    onChange={handleTextChange}
                    className={styles.textInput}
                    classNames={{
                      root: styles.inputRoot,
                      label: styles.inputLabel,
                      input: styles.input,
                    }}
                    size='md'
                  />
                </div>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && (
              <div className={styles.success}>ההעדפות נשמרו בהצלחה!</div>
            )}

            <div className={styles.actions}>
              <Button
                type='submit'
                className={styles.submitButton}
                loading={isLoading}
                variant='gradient'
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              >
                שמור העדפות
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Preferences;
