import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

import PointForm from './PointForm.jsx'
import UserList from './UserList.jsx'
import PointGraph from './PointGraph.jsx'
import PointHistory from './PointHistory.jsx'

function App() {
  const navigate = useNavigate()

  // 사용자 목록
  const [users, setUsers] = useState([
    { id: 1, name: '홍길동', point: 8500 },
    { id: 2, name: '김철수', point: 12000 },
    { id: 3, name: '이영희', point: 5500 }
  ])

  // 그래프 표시 여부
  const [showGraph, setShowGraph] = useState(false)

  // 선택한 사용자
  const [selectedId, setSelectedId] = useState('1')

  // 포인트 종류
  const [pointType, setPointType] = useState('add')

  // 입력할 포인트
  const [amount, setAmount] = useState('')

  // 결과 메시지
  const [message, setMessage] = useState('')

  // 포인트 변경 이력
  const [history, setHistory] = useState([])

  // 로그인 정보 확인
  const isLogin = localStorage.getItem('isLogin')
  const role = localStorage.getItem('role')

  // 관리자가 아니면 로그인 화면으로 이동
  if (isLogin !== 'true' || role !== 'admin') {
    navigate('/', { replace: true })
    return null
  }

  // 그래프 기준값 계산
  const points = users.map((user) => user.point)

  const maxPoint = Math.max(
    Math.max(...points),
    1
  )

  // 포인트 변경 함수
  const handlePointUpdate = () => {
    const pointValue = Number(amount)

    // 포인트 입력 확인
    if (amount === '' || pointValue <= 0) {
      setMessage('포인트를 올바르게 입력해주세요.')
      return
    }

    // 선택한 사용자 찾기
    const selectedUser = users.find(
      (user) => user.id === Number(selectedId)
    )

    // 사용자를 찾지 못한 경우
    if (!selectedUser) {
      setMessage('사용자를 선택해주세요.')
      return
    }

    // 포인트 차감 시 잔액 확인
    if (
      pointType === 'subtract' &&
      pointValue > selectedUser.point
    ) {
      setMessage(
        '현재 포인트보다 많이 차감할 수 없습니다.'
      )
      return
    }

    // 사용자 포인트 변경
    const updatedUsers = users.map((user) => {

      // 선택하지 않은 사용자는 그대로
      if (user.id !== Number(selectedId)) {
        return user
      }

      let newPoint

      // 포인트 적립
      if (pointType === 'add') {
        newPoint = user.point + pointValue
      }

      // 포인트 차감
      else {
        newPoint = user.point - pointValue
      }

      return {
        ...user,
        point: newPoint
      }
    })

    // 변경된 사용자 저장
    setUsers(updatedUsers)

    // 새로운 포인트 변경 이력
    const newHistory = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      name: selectedUser.name,
      type: pointType,
      point: pointValue
    }

    // 기존 이력 앞에 새로운 이력 추가
    const updatedHistory = [
      newHistory,
      ...history
    ]

    setHistory(updatedHistory)

    // 완료 메시지
    setMessage(
      '포인트가 정상적으로 반영되었습니다.'
    )

    // 입력창 초기화
    setAmount('')
  }

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('isLogin')
    localStorage.removeItem('role')

    navigate('/')
  }

  return (
    <main className="admin-page">

      <h1>관리자 포인트 관리</h1>

      {/* 포인트 지급 / 차감 */}
      <PointForm
        users={users}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        pointType={pointType}
        setPointType={setPointType}
        amount={amount}
        setAmount={setAmount}
        handlePointUpdate={handlePointUpdate}
        message={message}
      />

      {/* 사용자 목록 */}
      <UserList users={users} />

      {/* 버튼 */}
      <div className="button-area">

        <button
          onClick={() => setShowGraph(!showGraph)}
        >
          {showGraph
            ? '그래프 닫기'
            : '그래프 보기'}
        </button>

        <button onClick={handleLogout}>
          로그아웃
        </button>

      </div>

      {/* 그래프 */}
      {showGraph && (
        <PointGraph
          users={users}
          maxPoint={maxPoint}
        />
      )}

      {/* 포인트 변경 이력 */}
      <PointHistory history={history} />

    </main>
  )
}

export default App


