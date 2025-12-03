    let lanzamientos = 0;
    let exitos = 0;
    let puntajeTotal = 0;
    const puntosPorAcierto = 10;

    
    // Declarar la variable globalmente
    var signoSeleccionado = '';

    // Captura el valor seleccionado del <select> cada vez que se cambia
    document.getElementById('signo').addEventListener('change', function() {
        signoSeleccionado = this.value;
        console.log('Valor seleccionado:', signoSeleccionado);
    });


    // Declaración de vectores globales
    let probability = []; // Para almacenar probabilidades
    let valor = [];        // Para etiquetas o valores asociados


    const target = document.querySelector(".target");
    const scoreDisplay = document.getElementById("score");
    const prob = document.getElementById("probabilidad");

    const med = document.getElementById("media");
    const varia = document.getElementById("varianza");
    const desv = document.getElementById("desviacion");

    // MOVIMIENTO DEL PROYECTIL 
    const projectile = document.getElementById("projectile");

    // Variables para el arrastre
    let isDragging = false;
    let startX, startY, endX, endY;

    // Detectar el inicio del arrastre
    projectile.addEventListener("click", (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
    });

    // Detectar el final del arrastre y calcular la dirección
    document.addEventListener("mouseup", (event) => {
        if (isDragging) {
            isDragging = false;
            endX = event.clientX;
            endY = event.clientY;
            moveProjectile();
        }
    });

    // Función para mover el proyectil en la dirección del arraste
    function moveProjectile() {
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 10; // Ajusta la velocidad del proyectil
        const steps = distance / speed;
        let currentStep = 0;
        let score; // se guarda el puntaje que se obtiene

        // Obtener la posición inicial en píxeles absolutos
        let projectileX = projectile.getBoundingClientRect().left;
        let projectileY = projectile.getBoundingClientRect().top;

        // Movimiento continuo en la dirección seleccionada
        const interval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(interval);
                return;
            }
            currentStep++;

            // Incremento en cada paso
            projectileX += dx / steps;
            projectileY += dy / steps;

            // Actualizar la posición del proyectil usando `style.transform`
            projectile.style.transform = `translate(${projectileX - projectile.offsetLeft}px, ${projectileY - projectile.offsetTop}px)`;
            
            // Verificar el color actual debajo del proyectil
            score = checkColorUnderProjectile(score);


            // Obtener el elemento del input

            const lanzamiento = document.getElementById("lanzamientos");
            const exito = document.getElementById("exitos");

           // Leer el valor ingresado y convertirlo a número
            const n = parseFloat(lanzamiento.value); // Número de lanzamientos
            const k = parseFloat(exito.value);  // Número de éxitos deseados

            // Calcula la probabilidad basada en el puntaje obtenido
            const p = calculateProbabilityBasedOnScore(score);

            // Calcula la probabilidad binomial para obtener exactamente k éxitos
            const probability = binomialProbability(n, k, p, signoSeleccionado);

            const medi = media(n,p);
            const desviacion = desviacionEstandar(n,p);
            const vari = varianza(n,p);



            prob.textContent = `PROBABILIDAD: ${(probability * 100).toFixed(2)}%`;
            med.textContent = `MEDIA: ${(medi).toFixed(2)}`;
            varia.textContent =`VARIANZA: ${(vari).toFixed(2)}`;
            desv.textContent = `DESVIACIÓN ESTANDAR: ${(desviacion).toFixed(2)}`;
            drawChart(n,p);
        }, 20);
    }

    // Función para verificar el color del elemento debajo del proyectil
    function checkColorUnderProjectile(score) {
        const rect = projectile.getBoundingClientRect();

        // Hacer que el proyectil sea temporalmente invisible
        projectile.style.visibility = "hidden";

        // Detectar el elemento que está debajo del proyectil
        const elementBelow = document.elementFromPoint(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );

        // Restaurar la visibilidad del proyectil
        projectile.style.visibility = "visible";

        // Verificar y aplicar la lógica de puntaje
        if (elementBelow) {
            if (elementBelow.classList.contains("punto")) {
                score = 10;
            } else if (elementBelow.classList.contains("center")) {
                score = 8;
            } else if (elementBelow.classList.contains("circle3")) {
                score = 5;
            } else if (elementBelow.classList.contains("circle2")) {
                score = 3;
            } else if (elementBelow.classList.contains("circle1")) {
                score = 1;
            } else {
                score = 0;
            }
            scoreDisplay.textContent = `Puntaje: ${score}`;
            return score;
        }
    }

    // APLICANDO LA DISTRIBUCION BINOMIAL
    function factorial(num) {
        if (num <= 1) return 1;
        return num * factorial(num - 1);
    }

    function binomialCoefficient(n, k) {
        return factorial(n) / (factorial(k) * factorial(n - k));
    }

    function binomialProbability(n, k, p, s) {
        probability =[];
        valor = [];
        console.log("signo ", s);
        var r = 0;

        // Inicializamos los vectores con valores por defecto
        for (let i = 0; i <= n; i++) {
            probability[i] = 0; // Valor predeterminado para probabilidades
            valor[i] = i;      // Rango completo de valores
        }

        switch (s) {
            case 'igual': //bien
                r = binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
                probability[k]=r;
                break;
            case 'menor_igual': //bien
                while (k >= 0) {
                    var x=0;
                    x=binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
                    k--;
                    r=r+x;
                    probability[k]=x;
                }
                break;
            case 'mayor_igual': // bien
                for (var i = k; i < n; i++) {
                    var x=r;
                    x= binomialCoefficient(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
                    r=r+x;
                    probability[i]=x;
                }
                break;
            case'menor': // bien
                var i=0;
                while (i < k) {
                    var x=r;
                    x = binomialCoefficient(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
                    i++;
                    r=r+x;
                    probability[i]=x;
                }
                break;
            case 'mayor': //bien
            for (var i = k + 1; i <= n; i++) {
                var x=r;
                x = binomialCoefficient(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
                r=r+x;
                probability[i]=x;
            }
            break;
        }
        return r;
    }

    // calcular la media
    function media(n,p){
        return n*p;
    }
    // calcular la varianza
    function varianza(n,p){
        return n*p*(1-p);
    }
    // calcular la desviacion estandar
    function desviacionEstandar(n,p){
        return Math.sqrt(varianza(n,p));
    }


    // Asigna la probabilidad basada en el puntaje obtenido
    function calculateProbabilityBasedOnScore(score) {
        let p = 0;
        switch (score) {
            case 10:
                p = 0.1; // Alta probabilidad para puntaje alto
                break;
            case 8:
                p = 0.15;
                break;
            case 5:
                p = 0.20;
                break;
            case 3:
                p = 0.25;
                break;
            case 1:
                p = 0.30; // Baja probabilidad para puntaje bajo
                break;
            default:
                p = 0.05; // Sin puntaje, baja probabilidad
        }
        return p;
    }




// aqui empieza el codigo para crear al grafica
    const ctx = document.getElementById('binomialChart').getContext('2d');
    let binomialChart;

    // Generar datos para el gráfico
    function generateData(n, p) {
        const labels = valor;
        const data = probability;

        return { labels, data };
    }

    // Dibujar gráfico con Chart.js
    function drawChart(n, p) {
        const { labels, data } = generateData(n, p);

        if (binomialChart) {
            binomialChart.destroy(); // Destruir el gráfico anterior
        }

        binomialChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Distribución Binomial (n=${n}, p=${p})`,
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Probabilidad'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Número de éxitos'
                        }
                    }
                }
            }
        });
    }

    // Dibujar gráfico inicial con valores predeterminados
    drawChart(10, 0.5);