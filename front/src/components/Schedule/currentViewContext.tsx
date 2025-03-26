// import React, { createContext, useContext, useEffect, useState } from 'react';

// export type SCREENS = 'MAIN' | 'SCHEDULE' | 'ADMIN_DASHBOARD'|'SCHEDULE_FORM';

// interface ValuesContextType {
//   currentView: SCREENS;
//   setCurrentView: React.Dispatch<React.SetStateAction<SCREENS>>;
// }


// const ViewContext = createContext<ValuesContextType>({} as ValuesContextType);

// const ViewProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [currentView, setCurrentView] = useState<SCREENS>('MAIN');
//   useEffect(()=>{console.log("The current component is: ",currentView)},[currentView])

//   return (
//     <ViewContext.Provider value={{ currentView, setCurrentView }}>
//       {children}
//     </ViewContext.Provider>
//   );
// };

// export const useValues = () => {
//   return useContext(ViewContext);
// };

// export { ViewProvider, ViewContext };
