import { useState } from 'react'
import './MainMenu.css'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import milk from '../assets/milk.svg'
import fruit from '../assets/fruit.svg'
import special from '../assets/special.svg'
import seasonal from '../assets/calendar.svg'
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
                        <img src={milk} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Milk Teas</h3>
                    </Stack>
                </Button>
                
                <Button variant='contained' onClick={() => {
                    setOpenValue('series-f');
                    setSeriesName("Fruit Tea");
                }}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={fruit} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Fruit Teas</h3>
                    </Stack>
                </Button>

                <Button variant='contained' onClick={() => {
                    setOpenValue('series-sp');
                    setSeriesName('Specialty Drink');
                }}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={special} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Special Teas</h3>
                    </Stack>
                </Button>

                <Button variant='contained' onClick={() => {
                    setOpenValue('series-se');
                    setSeriesName('Seasonal Drink');
                }}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <img src={seasonal} alt="Milk Series" style={{ width: '120px', height: '120px' }} />
                        <h3>Seasonal Drinks</h3>
                    </Stack>
                </Button>
            </div>}


            {openValue === 'series-m' && <div className='series-page'>
                <div className='series-head'>
                    <h2>Milk Series</h2>
                    <Button variant='contained' onClick={() => setOpenValue('menu')}>Return</Button>
                </div>
                <SeriesLoad seriesName={seriesName} />
            </div>}


            {openValue === 'series-f' && <div className='series-page'>
                <div className='series-head'>
                    <h2>Fruit Series</h2>
                    <Button variant='contained' onClick={() => setOpenValue('menu')}>Return</Button>
                </div>
                <SeriesLoad seriesName={seriesName} />
            </div>}


            {openValue === 'series-sp' && <div className='series-page'>
                <div className='series-head'>
                    <h2>Special Series</h2>
                    <Button variant='contained' onClick={() => setOpenValue('menu')}>Return</Button>
                </div>
                <SeriesLoad seriesName={seriesName} />
            </div>}


            {openValue === 'series-se' && <div className='series-page'>
                <div className='series-head'>
                    <h2>Seasonal Series</h2>
                    <Button variant='contained' onClick={() => setOpenValue('menu')}>Return</Button>
                </div>
                <SeriesLoad seriesName={seriesName} />
              </div>}
        </div>
    );
}