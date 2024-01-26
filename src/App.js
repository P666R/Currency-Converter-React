import { useEffect, useState } from 'react';

export default function App() {
  const [amount, setAmount] = useState(0);
  const [output, setOutput] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('INR');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const debouncedAmount = amount;
    const debouncedFromCurrency = fromCurrency;
    const debouncedToCurrency = toCurrency;

    const debounceTimeout = setTimeout(() => {
      const conversion = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${debouncedAmount}&from=${debouncedFromCurrency}&to=${debouncedToCurrency}`
          );
          const data = await res.json();
          // console.log(data);
          setIsLoading(false);
          setOutput(data.rates[debouncedToCurrency]);
        } catch (error) {
          console.log(error);
        }
      };

      if (
        debouncedAmount > 0 &&
        debouncedFromCurrency !== debouncedToCurrency
      ) {
        conversion();
      } else setOutput(debouncedAmount);
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div>
      <input
        type="number"
        value={amount ? amount : ''}
        disabled={isLoading}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        value={fromCurrency}
        disabled={isLoading}
        onChange={(e) => setFromCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>

      <select
        value={toCurrency}
        disabled={isLoading}
        onChange={(e) => setToCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>

      <p>{output > 0 ? `${output} ${toCurrency}` : ''}</p>
    </div>
  );
}
