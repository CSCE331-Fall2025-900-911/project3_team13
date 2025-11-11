import { useState } from 'react'
import './MainMenu.css'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import reactLogo from '../assets/react.svg'
import { SeriesLoad } from './SeriesLoad'


export function MainMenu({ orderId }: { orderId: number }) {
    const [openValue, setOpenValue] = useState<'menu' | 'series-m' | 'series-f' | 'series-sp' | 'series-se'>('menu');
    const [seriesName, setSeriesName] = useState<string>("");

    return (
        <div className='main-menu'>
            {openValue === 'menu' && <div className="button-grid">
                <Button variant='contained' onClick={() => {
                    setOpenValue('series-m');
                    setSeriesName("Milk Tea");
                }}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Milk Teas</h3>
                    </Stack>
                </Button>
                
                <Button variant='contained' onClick={() => {
                    setOpenValue('series-f');
                    setSeriesName("Fruit Tea");
                }}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Fruit Teas</h3>
                    </Stack>
                </Button>

                <Button variant='contained' onClick={() => {
                    setOpenValue('series-sp');
                    setSeriesName('Specialty Drink');
                }}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Special Teas</h3>
                    </Stack>
                </Button>

                <Button variant='contained' onClick={() => {
                    setOpenValue('series-se');
                    setSeriesName('Seasonal Drink');
                }}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={reactLogo} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Seasonal Drinks</h3>
                    </Stack>
                </Button>
            </div>}


            {openValue === 'series-m' && <div className='series-page'>
                <div className='series-head'>
                    Milk Series
                    <Button onClick={() => setOpenValue('menu')}>Return</Button>
                </div>
                <SeriesLoad seriesName={seriesName} />
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