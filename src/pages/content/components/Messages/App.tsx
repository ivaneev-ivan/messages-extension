import { useEffect, useState } from "react"
import { GeneratedMessageList } from "./components/Message/MessageList"

const App = () => {
  const [move, setMove] = useState(true)
  const [hide, setHide] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 400, height: 400 })
  const [saveSize, setSaveSize] = useState({ width: 400, height: 400 })

  const [isDragging, setIsDragging] = useState(false)
  const [resizeDirection, setResizeDirection] = useState(null)

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isDragging && !resizeDirection) return
      let newX = event.clientX
      let newY = event.clientY
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height

      if (isDragging) {
        if (newY < 0) {
          newY = 0
        }
        console.log(screenWidth, newX + size.width)
        if (newY + size.height > screenHeight) {
          newY = screenHeight - size.height
        }
        if (newX + size.width > screenWidth) {
          newX = screenWidth - size.width
        }
        setPosition({ x: newX, y: newY })
      }

      if (resizeDirection === "se") {
        setSize({ width: newX - position.x, height: newY - position.y })
      } else if (resizeDirection === "sw") {
        setSize({
          width: position.x - newX + size.width,
          height: newY - position.y,
        })
        setPosition({ x: newX, y: position.y })
      } else if (resizeDirection === "ne") {
        setSize({
          width: newX - position.x,
          height: position.y - newY + size.height,
        })
        setPosition({ x: position.x, y: newY })
      } else if (resizeDirection === "nw") {
        setSize({
          width: position.x - newX + size.width,
          height: position.y - newY + size.height,
        })
        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setResizeDirection(null)
    }

    if (isDragging || resizeDirection) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, resizeDirection, position, size])

  const handleMouseDown = (event) => {
    const startX = event.clientX
    const startY = event.clientY
    const offsetX = startX - position.x
    const offsetY = startY - position.y

    if (
      startX > position.x + size.width - 10 &&
      startY > position.y + size.height - 10
    ) {
      setResizeDirection("se")
    } else if (
      startX < position.x + 10 &&
      startY > position.y + size.height - 10
    ) {
      setResizeDirection("sw")
    } else if (
      startX > position.x + size.width - 10 &&
      startY < position.y + 10
    ) {
      setResizeDirection("ne")
    } else if (startX < position.x + 10 && startY < position.y + 10) {
      setResizeDirection("nw")
    } else {
      setIsDragging(true)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setResizeDirection("")
    }

    const handleMouseMove = (event) => {
      if (!isDragging && !resizeDirection) return
      const newWidth = event.clientX - offsetX
      const newHeight = event.clientY - offsetY

      if (isDragging) {
        setPosition({ x: event.clientX - offsetX, y: event.clientY - offsetY })
      }

      if (resizeDirection === "se") {
        setSize({ width: newWidth, height: newHeight })
      } else if (resizeDirection === "sw") {
        setSize({
          width: position.x - event.clientX + size.width,
          height: newHeight,
        })

        setSize({
          width: position.x - event.clientX + size.width,
          height: newHeight,
        })
        setPosition({ x: event.clientX - offsetX, y: event.clientY - offsetY })
      } else if (resizeDirection === "ne") {
        setSize({
          width: newWidth,
          height: position.y - event.clientY + size.height,
        })
        setPosition({ x: event.clientX - offsetX, y: event.clientY })
      } else if (resizeDirection === "nw") {
        setSize({
          width: position.x - event.clientX + size.width,
          height: position.y - event.clientY + size.height,
        })
        setPosition({ x: event.clientX - offsetX, y: event.clientY })
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  useEffect(() => {
    const keyName = `position_user_window_${window.location.hostname}`
    chrome.storage.local.get(
      [keyName, "hideWindowUser", "windowUserSize", "moveWindowUser"],
      ({
        [keyName]: position,
        hideWindowUser,
        windowUserSize,
        moveWindowUser,
      }) => {
        if (position) setPosition(position)
        if (hideWindowUser) setHide(hideWindowUser)
        if (windowUserSize) setSize(windowUserSize)
        if (moveWindowUser) setMove(moveWindowUser)
      }
    )
  }, [])

  useEffect(() => {
    const keyName = `position_user_window_${window.location.hostname}`
    chrome.storage.local.set({ [keyName]: position })
  }, [position])

  useEffect(() => {
    if (!hide) {
      setSize(saveSize)
      setSaveSize({ height: 1, width: 1 })
    } else {
      setSaveSize(size)
      setSize({ height: 100, width: 300 })
    }
    chrome.storage.local.set({
      hideWindowUser: hide,
    })
  }, [hide])

  useEffect(() => {
    chrome.storage.local.set({
      windowUserSize: !hide ? size : saveSize,
    })
  }, [size, saveSize])

  useEffect(() => {
    chrome.storage.local.set({
      moveWindowUser: move,
    })
  }, [move])

  return (
    <div
      style={{
        width: !hide ? size.width + "px" : "auto",
        height: !hide ? size.height + "px" : "auto",
        position: "fixed",
        left: position.x + "px",
        top: position.y + "px",
        resize: "both",
        overflow: "auto",
        userSelect: "none",
        zIndex: 9999,
        cursor: resizeDirection ? "se-resize" : "move",
      }}
      className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
      onMouseDown={
        move
          ? handleMouseDown
          : () => {
              // Doesnt work move element
            }
      }
    >
      <button
        className="py-2 px-3 bg-blue-400 hover:bg-blue-500 text-white text-center"
        onClick={() => setMove(!move)}
      >
        {!move ? "Статичный" : "Подвиждный"}
      </button>
      <button
        className="py-2 px-3 bg-slate-400 hover:bg-slate-500 text-white text-center"
        onClick={() => setHide(!hide)}
      >
        {hide ? "Скрытый" : "Видимый"}
      </button>

      {!hide && (
        <>
          <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50 transition">
            All messages
          </h5>
          <GeneratedMessageList />
        </>
      )}
    </div>
  )
}

export default App
