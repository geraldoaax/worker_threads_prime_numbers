const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

if (isMainThread) {
  const numWorkers = 7;
  const maxPrime = 1e5; // Limite superior para cálculo de números primos

  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker(__filename, { workerData: { id: i, maxPrime } });
    worker.on("message", (msg) => {
      console.log(
        `Worker ${msg.id}: Calculou ${msg.primeCount} números primos até ${maxPrime}.`
      );
      console.log(`Tempo de execução: ${msg.executionTime}ms`);
    });
  }
} else {
  const { id, maxPrime } = workerData;

  const start = Date.now();
  let primeCount = 0;

  // Função para calcular se um número é primo
  function isPrime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return num > 1;
  }

  // Calculando números primos
  for (let i = 2; i <= maxPrime; i++) {
    if (isPrime(i)) primeCount++;
  }

  const end = Date.now();

  parentPort.postMessage({
    id: id,
    primeCount: primeCount,
    executionTime: end - start,
  });
}
