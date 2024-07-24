import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = parseFloat(name.split(' ')[0]);
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ price, name: name.substring(price.toString().length + 1), description, datetime })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        console.log('result', json);
      });
    });
  }

  let bal = 0;
  for (const i of transactions) {
    bal = bal + i.price;
  }

  bal = bal.toFixed(2);
  const fr = bal.split('.')[1];
  bal = bal.split('.')[0];

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src="https://th.bing.com/th/id/OIP.84UrLa9gpg3OOuhEgJ1nQAHaHV?w=178&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7" alt="Logo" />
          <span>Expense Tracker</span>
        </div>
      </nav>
      <main>
        <h1>${bal}<span>{fr}</span></h1>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder={'+200 new samsung tv'} />
            <input type="datetime-local" value={datetime}
              onChange={ev => setDatetime(ev.target.value)} />
          </div>
          <div className="description">
            <input type="text" value={description}
              onChange={ev => setDescription(ev.target.value)}
              placeholder={'description'} />
          </div>
          <button type="submit">
            Add new Transaction
          </button>
          {transactions.length}
        </form>
        <div className="transactions">
          {transactions.length > 0 && transactions.map(transaction => (
            <div className="transaction" key={transaction._id}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={"price-" + (transaction.price < 0 ? "red" : "green")}>{transaction.price}</div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
