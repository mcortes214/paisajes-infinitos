/*
PRÓXIMAS COSAS A HACER:

Que cada montaña conserve su propio array, de forma que los puntos se puedan transformar (y que siempre se generen números altos,
 multiplicados con un multiplicador que va a ser la variación vertical).
 Implementar como un objeto Montañas, con una propiedad por montaña, cada una de la cual es un array que se agrega programáticamente según
 la cantidad de capas usada.
https://stackoverflow.com/questions/1184123/is-it-possible-to-add-dynamically-named-properties-to-javascript-object
Operaciones que se podrían realizar:
- Separar las Montañas
- Aplastarlas o ensancharlas

Otras operaciones con otras variables:
- Cambiar el color de fondo con RGB
- Blur para las montañas en vez de círculos: http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
-

- Generar nubes de alguna manera
- Agregar precipitaciones (densidad y opacidad variables)

*/

var opciones = {
  'opacidadMontaña':0.1,
  'desplazamientoMediaVertical':0,
  'capasDeMontañas':4,
  'variacionVerticalPorPaso':5,
  'detalle':250
};

//Variables de contexto
var canvas, ctx;
var canvasWidth, canvasHeight;

//Variables de color
var opacidadMontaña = opciones.opacidadMontaña; //modificable, entre 0 y 1
var colR, colG, colB, backgroundColorString;

//montaña
var desplazamientoMediaVertical = opciones.desplazamientoMediaVertical;
var capasDeMontañas = opciones.capasDeMontañas;      //modificable
var variacionVerticalPorPaso = opciones.variacionVerticalPorPaso;  //modificable
var resolucion = opciones.detalle;
var arrayPuntosMontaña = [];
var stepWidth;

//niebla
var gradienteNiebla;
var pxData;
var cx, cy; //X de circulo, Y de circulo

//utilidad
var i, j, a;

$('document').ready(function(){

//INICIALIZACIÓN

  //Inicializar contexto
  canvas = document.getElementById('paisaje');
  ctx = canvas.getContext('2d');
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  //Inicializar montaña
  a=canvasHeight/2;
  for(i=0; i<resolucion; i++){
    arrayPuntosMontaña.push(0);
  }

//DIBUJO
  dibujarEscena();
});

function dibujarEscena(){
  //Generar color de fondo
    colR = parseInt(Math.random()*255);
    colG = parseInt(Math.random()*255);
    colB = parseInt(Math.random()*255);
    backgroundColorString = 'rgb(' + colR +','+ colG+','+ colB +')';
    ctx.fillStyle = backgroundColorString;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); //Generar rectángulo

  //Generar montañas
    stepWidth = canvasWidth/resolucion;
    ctx.fillStyle = 'rgba(0,0,0,'+opacidadMontaña+')';
    for(j=0;j<capasDeMontañas;j++){     // HACK: la variable global 'i' ya está operando dentro de generarMontaña(). Modularizar
      generarMontaña();
    }

  //Generar niebla
    gradienteNiebla = ctx.createLinearGradient (0, 0, 0, canvasHeight);
    gradienteNiebla.addColorStop (0, 'rgba(255,255,255,0)');
    gradienteNiebla.addColorStop (1, 'white');
    ctx.globalAlpha=0.7;
    ctx.fillStyle = gradienteNiebla;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);

  //generar circulos
  ctx.globalAlpha=0.005;
  for(var i=0; i<800; i++){
    cx = parseInt(Math.random()*canvasWidth);
    cy = parseInt(Math.random()*canvasHeight);
    pxData = ctx.getImageData (cx,cy,1,1);
    ctx.fillStyle = 'rgba('+pxData.data[0]+','+pxData.data[1]+','+pxData.data[2]+','+pxData.data[3]+')';
    ctx.beginPath();
      ctx.arc (cx, cy, 90, 0, 2*Math.PI, false);
    ctx.fill();
  }
}


//Funciones

function generarMontaña(){
  //Inicializar array
  a=canvasHeight/2+desplazamientoMediaVertical;
  for(i=0; i<resolucion; i++){
    a = a + parseInt(Math.random()*variacionVerticalPorPaso*2-variacionVerticalPorPaso);
    arrayPuntosMontaña[i] = a;
  }

  ctx.beginPath();
    //setup
    ctx.moveTo(0, canvasHeight/2+desplazamientoMediaVertical); //primer punto de la línea
    //líneas aleatorias
    for(i=0;i<arrayPuntosMontaña.length;i++){
      ctx.lineTo(stepWidth*(i+1),arrayPuntosMontaña[i]);
    }
    //líneas de cierre
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight/2+desplazamientoMediaVertical);
  ctx.fill();
}
