import React, { useState, useRef, useEffect } from 'react'

export default function ResizablePanel({ 
  children, 
  defaultWidth = 300, 
  minWidth = 200, 
  maxWidth = 600,
  side = 'left' // 'left' or 'right'
}) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      const panel = panelRef.current
      if (!panel) return

      const rect = panel.getBoundingClientRect()
      let newWidth

      if (side === 'left') {
        newWidth = e.clientX - rect.left
      } else {
        newWidth = rect.right - e.clientX
      }

      // Constrain width
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = side === 'left' ? 'ew-resize' : 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, side, minWidth, maxWidth])

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const resizeHandleStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '4px',
    cursor: 'ew-resize',
    background: 'transparent',
    zIndex: 10,
    ...(side === 'left' ? { right: 0 } : { left: 0 }),
    transition: isResizing ? 'none' : 'background 0.2s'
  }

  const resizeHandleHoverStyle = {
    background: '#667eea'
  }

  return (
    <div
      ref={panelRef}
      style={{
        width: `${width}px`,
        position: 'relative',
        flexShrink: 0
      }}
    >
      {children}
      <div
        style={resizeHandleStyle}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          if (!isResizing) e.currentTarget.style.background = '#667eea'
        }}
        onMouseLeave={(e) => {
          if (!isResizing) e.currentTarget.style.background = 'transparent'
        }}
      />
    </div>
  )
}
