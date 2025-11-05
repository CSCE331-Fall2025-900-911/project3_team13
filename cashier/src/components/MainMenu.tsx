import { useState } from 'react'
import './MainMenu.css'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import reactLogo from '../assets/react.svg'


export function MainMenu() {
    const [openValue, setOpenValue] = useState<'menu' | 'series-m' | 'series-f' | 'series-sp' | 'series-se'>('menu');

    return (
        <div className='main-menu'>
            {openValue === 'menu' && <div className="button-grid">
                <Button variant='contained' onClick={() => setOpenValue('series-m')}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Milk Teas</h3>
                    </Stack>
                </Button>
                
                <Button variant='contained' onClick={() => setOpenValue('series-f')}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Fruit Teas</h3>
                    </Stack>
                </Button>

                <Button variant='contained' onClick={() => setOpenValue('series-sp')}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Special Teas</h3>
                    </Stack>
                </Button>

                <Button variant='contained' onClick={() => setOpenValue('series-se')}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Seasonal Drinks</h3>
                    </Stack>
                </Button>
            </div>}


            {openValue === 'series-m' && <div>
                Milk Series
                <Button onClick={() => setOpenValue('menu')}>Return</Button>
            </div>}


            {openValue === 'series-f' && <div>
                Fruit Series
                <Button onClick={() => setOpenValue('menu')}>Return</Button>
            </div>}


            {openValue === 'series-sp' && <div>
                Special Series
                <Button onClick={() => setOpenValue('menu')}>Return</Button>
            </div>}


            {openValue === 'series-se' && <div>
                Seasonal Series
                <Button onClick={() => setOpenValue('menu')}>Return</Button>
              </div>}
        </div>
    );
}