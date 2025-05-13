import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io("http://localhost:3000")

type Leaderboard = {
  gamertag: string
  score: number
  car: string
  level: number
}

export default function App() {

  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/leaderboard/top?limit=10')
      .then(response => response.ok && response.json())
      .then(data => {
        setLeaderboards(data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Conectado ao websocket.")
    })
    socket.on('leaderboardUpdate', (data) => {
      console.log("Leaderboard atualizada: ", data)
      setLeaderboards(data)
    })
  }, [leaderboards])

  return (
    <main>
      {/* <div className="overlay"></div> */}
      <section>
        <div className="table-title">
          <h1>Leaderboard</h1>
          <p>Akina Mountain</p>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nível</th>
                <th>Gamertag</th>
                <th>Carro</th>
                <th>Pontuação de Drift</th>
              </tr>
            </thead>
            <tbody>
              {/* Exemplo de dados estáticos */}
              {leaderboards.map((leaderboard, i) => (
                <tr key={i}>
                  <td>
                    {leaderboard.level}
                  </td>
                  <td>
                    {leaderboard.gamertag}
                  </td>
                  <td>
                    {leaderboard.car}
                  </td>
                  <td>
                    {leaderboard.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-description">
            <p>Modalidade: Descida</p>
            <p>Exibindo 10 de 20000</p>
          </div>
        </div>
      </section>
    </main>
  )
}
