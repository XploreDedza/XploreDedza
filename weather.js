/**
 * Local weather module for Dedza.
 * - Uses OpenWeatherMap (replace OPENWEATHER_API_KEY)
 * - Renders animated backgrounds (rain/sun/fog) on canvas using simple particle systems
 * - Populates rain intensity graph using Chart.js
 *
 * Important:
 * - You can swap the API to WeatherAPI or your backend.
 * - If offline, the offline banner shows and cached last-known values can be used.
 */

const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // replace
const CITY = 'Dedza,MW';
const weatherCanvas = document.getElementById('weatherCanvas');
const weatherCtx = weatherCanvas && weatherCanvas.getContext('2d');

function resizeWeatherCanvas(){ if(!weatherCanvas) return; weatherCanvas.width = weatherCanvas.clientWidth; weatherCanvas.height = weatherCanvas.clientHeight; }
resizeWeatherCanvas(); window.addEventListener('resize', resizeWeatherCanvas);

async function fetchWeather(){
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    const data = await res.json();
    updateWeatherUI(data);
    fetchHourly(); // load hourly for rain graph
  } catch(e){
    // offline handling
    document.getElementById('offlineBanner').hidden = false;
    document.getElementById('weatherCondition').textContent = 'Offline';
  }
}

async function fetchHourly(){
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(CITY)}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    const d = await res.json();
    const next3 = d.list.slice(0,6); // next 6 x 3hr intervals
    const labels = next3.map(i=> new Date(i.dt*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
    const precip = next3.map(i=> i.pop ? Math.round(i.pop*100) : 0);
    renderRainGraph(labels, precip);
  } catch(e){
    // ignore
  }
}

function updateWeatherUI(data){
  if(!data || !data.weather) return;
  document.getElementById('weatherCondition').textContent = data.weather[0].description;
  document.getElementById('tempValue').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  document.getElementById('precip').textContent = `Precip: ${data.rain ? (data.rain['1h'] || 0) + '%' : '—'}`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind').textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`; // m/s -> km/h

  // choose animation based on main weather
  const main = data.weather[0].main.toLowerCase();
  if(main.includes('rain') || main.includes('drizzle')) startRainAnim();
  else if(main.includes('snow')) startSnowAnim();
  else if(main.includes('cloud')) startCloudAnim();
  else startSunAnim();
}

/* Simple particle-based rain/snow/cloud */
let animFrame, particles=[];
function startRainAnim(){
  cancelAnim(); particles=[]; const w=weatherCanvas.width, h=weatherCanvas.height;
  for(let i=0;i<120;i++) particles.push({x:Math.random()*w,y:Math.random()*h,vy:4+Math.random()*6,len:8+Math.random()*8,alpha:0.5+Math.random()*0.5});
  function draw(){
    weatherCtx.clearRect(0,0,w,h);
    weatherCtx.fillStyle = 'rgba(0,0,0,0.0)';
    weatherCtx.fillRect(0,0,w,h);
    weatherCtx.strokeStyle = 'rgba(255,255,255,0.6)';
    weatherCtx.lineWidth = 1.2;
    particles.forEach(p=>{
      weatherCtx.beginPath();
      weatherCtx.moveTo(p.x,p.y);
      weatherCtx.lineTo(p.x+ (p.vy*0.2), p.y + p.len);
      weatherCtx.stroke();
      p.x += p.vy*0.6;
      p.y += p.vy;
      if(p.y > h){ p.y = -10; p.x = Math.random()*w; }
      if(p.x > w) p.x = p.x - w;
    });
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

function startSnowAnim(){
  cancelAnim(); particles=[];
  const w=weatherCanvas.width,h=weatherCanvas.height;
  for(let i=0;i<80;i++) particles.push({x:Math.random()*w,y:Math.random()*h,vy:0.4+Math.random()*1.2,r:1+Math.random()*3,angle:Math.random()*Math.PI*2});
  function draw(){
    weatherCtx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      weatherCtx.fillStyle = 'rgba(255,255,255,0.9)';
      weatherCtx.beginPath();
      weatherCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
      weatherCtx.fill();
      p.x += Math.sin(p.angle)*0.5; p.y += p.vy; p.angle += 0.01;
      if(p.y > h){ p.y = -10; p.x = Math.random()*w; }
    });
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

function startCloudAnim(){
  cancelAnim(); particles=[];
  const w=weatherCanvas.width,h=weatherCanvas.height;
  // draw translucent layered clouds (simple)
  function draw(){
    weatherCtx.clearRect(0,0,w,h);
    const grad = weatherCtx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, 'rgba(255,255,255,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0.06)');
    weatherCtx.fillStyle = grad;
    weatherCtx.fillRect(0,0,w,h);
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

function startSunAnim(){
  cancelAnim();
  const w=weatherCanvas.width,h=weatherCanvas.height;
  let t = 0;
  function draw(){
    weatherCtx.clearRect(0,0,w,h);
    // sun glow
    const cx = w - 80, cy = 60;
    const r = 40 + 6*Math.sin(t/60);
    const g = weatherCtx.createRadialGradient(cx,cy,0,cx,cy,r*2);
    g.addColorStop(0,'rgba(251,192,45,0.9)');
    g.addColorStop(1,'rgba(251,192,45,0.0)');
    weatherCtx.fillStyle = g;
    weatherCtx.beginPath(); weatherCtx.arc(cx,cy,r,0,Math.PI*2); weatherCtx.fill();
    t++;
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

function cancelAnim(){ if(animFrame) cancelAnimationFrame(animFrame); particles=[]; if(weatherCtx) weatherCtx.clearRect(0,0,weatherCanvas.width,weatherCanvas.height); }

function renderRainGraph(labels, data){
  const ctx = document.getElementById('rainGraph').getContext('2d');
  new Chart(ctx, {
    type:'line',
    data:{
      labels,
      datasets:[{label:'Precipitation', data, borderColor:'#2e7d32', backgroundColor:'rgba(46,125,50,0.08)', tension:0.3, pointRadius:0}]
    },
    options:{
      responsive:true, maintainAspectRatio:false, scales:{x:{display:false}, y:{display:false}}, plugins:{legend:{display:false}}
    }
  });
}

// start the module
window.addEventListener('load', ()=> {
  if(navigator.onLine === false) document.getElementById('offlineBanner').hidden = false;
  fetchWeather();
  // refresh every 15 minutes
  setInterval(fetchWeather, 15*60*1000);
});
