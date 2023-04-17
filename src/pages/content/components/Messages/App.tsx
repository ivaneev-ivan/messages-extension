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
  }, [isDragging, resizeDirection, position])

  const handleMouseDown = (event) => {
    const startX = event.clientX
    const startY = event.clientY
    const offsetX = startX - position.x
    const offsetY = startY - position.y
    const offsetWidth = startX - size.width
    const offsetHeight = startY - size.height

    if (
      startX > position.x + size.width - 10 &&
      startY > position.y + size.height - 10
    ) {
      setResizeDirection("se")
    } else {
      setIsDragging(true)
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
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setResizeDirection(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        border: "1px solid #000",
        background: "lightgrey",
        userSelect: "none",
        zIndex: 9999,
        cursor: resizeDirection ? "se-resize" : "move",
      }}
      onMouseDown={handleMouseDown}
    ></div>
  )
}

export default App
