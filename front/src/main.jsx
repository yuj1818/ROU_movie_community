import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './main.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/ko';

dayjs.extend(isLeapYear);
dayjs.locale('ko');
dayjs.extend(relativeTime);

createRoot(document.getElementById('root')).render(<App />);
