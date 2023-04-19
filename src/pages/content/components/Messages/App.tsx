import { useEffect, useState } from "react"

const App = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 100, height: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [resizeDirection, setResizeDirection] = useState(null)

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isDragging && !resizeDirection) return
      const newX = event.clientX
      const newY = event.clientY

      if (isDragging) {
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

  return (
    <div
      style={{
        width: size.width + "px",
        height: size.height + "px",
        border: "1px solid black",
        position: "fixed",
        left: position.x + "px",
        top: position.y + "px",
        resize: "both",
        overflow: "auto",
        background: "lightgrey",
        userSelect: "none",
        zIndex: 9999,
        cursor: resizeDirection ? "se-resize" : "move",
      }}
      onMouseDown={handleMouseDown}
    >
      Размер изменяемого блока
    </div>
  )
}

export default App
