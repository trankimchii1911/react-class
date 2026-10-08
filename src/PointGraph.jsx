function PointGraph({ users, maxPoint }) {
  return (
    <section className="graph-area">

      <h2>사용자별 포인트 그래프</h2>

      {users.map((user) => (
        <div
          className="graph-row"
          key={user.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}
        >

          <span
            className="graph-name"
            style={{
              width: '70px',
              fontWeight: 'bold'
            }}
          >
            {user.name}
          </span>

          <div
            className="graph-background"
            style={{
              width: '350px',
              height: '30px',
              background: '#e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <div
              className="graph-bar"
              style={{
                width: `${(user.point / maxPoint) * 100}%`,
                height: '100%',
                background: '#6366f1',
                borderRadius: '8px'
              }}
            >
            </div>
          </div>

          <strong>
            {user.point.toLocaleString()} P
          </strong>

        </div>
      ))}

    </section>
  )
}

export default PointGraph