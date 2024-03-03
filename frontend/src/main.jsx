
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import GridBackground from './ui/GridBackground.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
			<GridBackground>
				<App />
			</GridBackground>
		</BrowserRouter>
)
