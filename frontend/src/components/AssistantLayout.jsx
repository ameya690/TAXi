import React, { useState, useRef } from 'react'
import tokens from '../styles/designTokens'
import ContextRail from './assistant/ContextRail_new.jsx'
import SourcesRail from './assistant/SourcesRail_enhanced.jsx'
import Composer from './assistant/Composer_new.jsx'

export default function AssistantLayout({ 
  lang, 
  t, 
  children,
  onSend,
  isLoading,
  selectedMatter: propSelectedMatter,
  docsInScope: propDocsInScope,
  onDocumentsUploaded
}) {
  const [leftWidth, setLeftWidth] = useState(280)
  const [rightWidth, setRightWidth] = useState(320)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  
  // Use props if provided, otherwise use local state
  const selectedMatter = propSelectedMatter || 'Acme Corp'
  const docsInScope = propDocsInScope || []
  
  // Context state (local)
  const [knowledgeSources, setKnowledgeSources] = useState({
    irs_pubs: true,
    tax_code: false,
    case_law: true,
    regulations: false
  })

  const containerRef = useRef(null)

  const handleMouseDownLeft = (e) => {
    e.preventDefault()
    setIsResizingLeft(true)
  }

  const handleMouseDownRight = (e) => {
    e.preventDefault()
    setIsResizingRight(true)
  }

  const handleMouseMove = (e) => {
    if (isResizingLeft && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left
      if (newWidth >= 200 && newWidth <= 400) {
        setLeftWidth(newWidth)
      }
    }
    if (isResizingRight && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = containerRect.right - e.clientX
      if (newWidth >= 280 && newWidth <= 480) {
        setRightWidth(newWidth)
      }
    }
  }

  const handleMouseUp = () => {
    setIsResizingLeft(false)
    setIsResizingRight(false)
  }

  React.useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizingLeft, isResizingRight])

  const handleAddDocs = () => {
    console.log('Add documents')
    // Implement document picker
  }

  const handleSendMessage = (message) => {
    console.log('Send message:', message)
    // Call the parent's onSend handler
    if (onSend) {
      onSend(message)
    }
  }

  const styles = {
    container: {
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      userSelect: (isResizingLeft || isResizingRight) ? 'none' : 'auto'
    },
    leftRail: {
      width: `${leftWidth}px`,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    },
    resizer: {
      width: '4px',
      background: 'transparent',
      cursor: 'col-resize',
      flexShrink: 0,
      position: 'relative',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    resizerActive: {
      background: tokens.colors.primary[600]
    },
    resizerHover: {
      background: tokens.colors.neutral[300]
    },
    centerPane: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      minWidth: '400px',
      position: 'relative'
    },
    centerScroll: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: tokens.spacing.lg
    },
    composerContainer: {
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      background: tokens.colors.surface1,
      borderTop: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      zIndex: 10
    },
    rightRail: {
      width: `${rightWidth}px`,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Left Context Rail */}
      <div style={styles.leftRail}>
        <ContextRail
          selectedMatter={selectedMatter}
          setSelectedMatter={(matter) => {
            // Matter selection is controlled by parent
            console.log('Matter selected:', matter)
          }}
          knowledgeSources={knowledgeSources}
          setKnowledgeSources={setKnowledgeSources}
          docsInScope={docsInScope}
          onAddDocs={handleAddDocs}
        />
      </div>

      {/* Left Resizer */}
      <div
        style={{
          ...styles.resizer,
          ...(isResizingLeft ? styles.resizerActive : {})
        }}
        onMouseDown={handleMouseDownLeft}
        onMouseOver={(e) => {
          if (!isResizingLeft) {
            e.currentTarget.style.background = tokens.colors.neutral[300]
          }
        }}
        onMouseOut={(e) => {
          if (!isResizingLeft) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      />

      {/* Center Pane */}
      <div style={styles.centerPane}>
        <div style={styles.centerScroll}>
          {children}
        </div>
        
        {/* Sticky Composer */}
        <div style={styles.composerContainer}>
          <Composer
            onSend={handleSendMessage}
            selectedMatter={selectedMatter}
            docsInScope={docsInScope}
            isThinking={isLoading}
            onDocumentsUploaded={onDocumentsUploaded}
          />
        </div>
      </div>

      {/* Right Resizer */}
      <div
        style={{
          ...styles.resizer,
          ...(isResizingRight ? styles.resizerActive : {})
        }}
        onMouseDown={handleMouseDownRight}
        onMouseOver={(e) => {
          if (!isResizingRight) {
            e.currentTarget.style.background = tokens.colors.neutral[300]
          }
        }}
        onMouseOut={(e) => {
          if (!isResizingRight) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      />

      {/* Right Sources Rail */}
      <div style={styles.rightRail}>
        <SourcesRail />
      </div>
    </div>
  )
}
