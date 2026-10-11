import React, { useState, useRef, useLayoutEffect } from 'react';
import type { WhiteboardElement, WhiteboardPath, WhiteboardTextElement, WhiteboardTool } from '../types.ts';

interface WhiteboardProps {
    elements: WhiteboardElement[];
    onElementsUpdate: (elements: WhiteboardElement[]) => void;
    activeTool: WhiteboardTool;
    strokeColor: string;
    strokeWidth: number;
    isTeacher: boolean;
}

const pointsToPath = (points: { x: number, y: number }[]) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    points.forEach(point => {
        path += ` L ${point.x} ${point.y}`;
    });
    return path;
};

const Whiteboard: React.FC<WhiteboardProps> = ({ elements, onElementsUpdate, activeTool, strokeColor, strokeWidth, isTeacher }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [drawingElement, setDrawingElement] = useState<WhiteboardPath | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [textStartCoords, setTextStartCoords] = useState<{ x: number, y: number } | null>(null);
    const [movingElement, setMovingElement] = useState<{ id: string; initialX: number; initialY: number; startX: number; startY: number } | null>(null);
    
    // State for text input
    const [isWriting, setIsWriting] = useState(false);
    const [textInput, setTextInput] = useState({ x: 0, y: 0, text: '', width: 300, editingElementId: null as string | null });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const getCursorClass = () => {
        if (!isTeacher) return 'cursor-default';
        switch (activeTool) {
            case 'pen':
            case 'highlighter': return 'cursor-crosshair';
            case 'eraser': return 'cursor-cell';
            case 'text': return 'cursor-text';
            case 'select': return 'cursor-default';
            default: return 'cursor-default';
        }
    };
    
    const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number, y: number } | null => {
        if (!svgRef.current) return null;
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        
        if ('touches' in e) {
            const touch = e.touches[0] || e.changedTouches[0];
            if (!touch) return null;
            pt.x = touch.clientX;
            pt.y = touch.clientY;
        } else {
            pt.x = (e as React.MouseEvent).clientX;
            pt.y = (e as React.MouseEvent).clientY;
        }
        
        const screenCTM = svg.getScreenCTM();
        if (screenCTM) {
            return pt.matrixTransform(screenCTM.inverse());
        }
        return null;
    };

    const saveText = () => {
        if (!isWriting) return;

        let newElements = [...elements];
        const { text, x, y, width, editingElementId } = textInput;

        if (text.trim()) {
            if (editingElementId) {
                newElements = newElements.map(el => {
                    if (el.id === editingElementId && el.type === 'text') {
                        return { ...el, text, width };
                    }
                    return el;
                });
            } else {
                const newElement: WhiteboardTextElement = {
                    id: `text-${Date.now()}`,
                    type: 'text',
                    x,
                    y,
                    text,
                    color: strokeColor,
                    fontSize: 28,
                    width,
                };
                newElements.push(newElement);
            }
            onElementsUpdate(newElements);
        } else if (editingElementId) {
            newElements = newElements.filter(el => el.id !== editingElementId);
            onElementsUpdate(newElements);
        }
        
        setIsWriting(false);
        setTextInput({ x: 0, y: 0, text: '', width: 300, editingElementId: null });
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const target = e.target as HTMLElement;
        if (isWriting && textareaRef.current && !textareaRef.current.contains(target)) {
            saveText();
            return;
        }
        
        if (!isTeacher || movingElement || isWriting) return;
        
        const coords = getCoordinates(e);
        if (!coords) return;
        
        if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser') {
            setIsDrawing(true);
            const newElement: WhiteboardPath = {
                id: `path-${Date.now()}`,
                type: 'path',
                points: [coords],
                color: activeTool === 'eraser' ? '#0f172a' : strokeColor, // Using slate-900 for eraser
                strokeWidth: activeTool === 'pen' 
                    ? strokeWidth 
                    : activeTool === 'highlighter'
                        ? Math.max(40, strokeWidth * 4)
                        : Math.max(50, strokeWidth * 5),
                mode: activeTool as 'pen' | 'highlighter' | 'eraser',
            };
            setDrawingElement(newElement);
        } else if (activeTool === 'text') {
            setTextStartCoords(coords);
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isTeacher) return;
        const coords = getCoordinates(e);
        if (!coords) return;

        if (movingElement) {
            const dx = coords.x - movingElement.startX;
            const dy = coords.y - movingElement.startY;
            const newElements = elements.map(el => {
                if (el.id === movingElement.id && el.type === 'text') {
                    return { ...el, x: movingElement.initialX + dx, y: movingElement.initialY + dy };
                }
                return el;
            });
            onElementsUpdate(newElements as WhiteboardElement[]);
            return;
        }
        
        if (!isDrawing || !drawingElement) return;

        if (activeTool === 'text' && textStartCoords) {
             const distance = Math.hypot(coords.x - textStartCoords.x, coords.y - textStartCoords.y);
             if (distance > 5) setTextStartCoords(null);
        }
        
        const updatedElement = { ...drawingElement, points: [...drawingElement.points, coords] };
        setDrawingElement(updatedElement);
    };
    
    const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isTeacher) return;

        const coords = getCoordinates(e);
        if (textStartCoords && activeTool === 'text' && coords) {
            const distance = Math.hypot(coords.x - textStartCoords.x, coords.y - textStartCoords.y);
            if (distance < 5) {
                setIsWriting(true);
                setTextInput({ x: textStartCoords.x, y: textStartCoords.y, text: '', width: 300, editingElementId: null });
            }
            setTextStartCoords(null);
            return;
        }
        
        if(movingElement) setMovingElement(null);

        setIsDrawing(false);
        if (drawingElement && drawingElement.points.length > 1) {
            onElementsUpdate([...elements, drawingElement]);
        }
        setDrawingElement(null);
    };

    useLayoutEffect(() => {
        if (isWriting && textareaRef.current) {
            setTimeout(() => {
                const textarea = textareaRef.current;
                if(textarea) {
                    textarea.focus();
                    textarea.style.height = 'auto';
                    textarea.style.height = `${textarea.scrollHeight}px`;
                    const newWidth = Math.max(300, textarea.scrollWidth);
                    textarea.style.width = `${newWidth}px`;
                }
            }, 0);
        }
    }, [isWriting, textInput.x, textInput.y]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        const newWidth = Math.max(300, textarea.scrollWidth);
        textarea.style.width = `${newWidth}px`;
        setTextInput(prev => ({ ...prev, text: e.target.value, width: newWidth }));
    };

    const handleElementMouseDown = (el: WhiteboardTextElement, e: React.MouseEvent) => {
        if (!isTeacher || activeTool !== 'select') return;
        e.stopPropagation();
        const coords = getCoordinates(e);
        if (!coords) return;
        setMovingElement({
            id: el.id,
            initialX: el.x,
            initialY: el.y,
            startX: coords.x,
            startY: coords.y,
        });
    };
    
    const handleElementDoubleClick = (elToEdit: WhiteboardTextElement, e: React.MouseEvent) => {
        if (!isTeacher || activeTool !== 'select') return;
        e.stopPropagation();
        setMovingElement(null);
        if (isWriting) saveText();
        setIsWriting(true);
        setTextInput({
            x: elToEdit.x,
            y: elToEdit.y,
            text: elToEdit.text,
            width: elToEdit.width,
            editingElementId: elToEdit.id,
        });
    };

    return (
        <div className={`w-full h-full bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group ${getCursorClass()}`}>
            <svg
                ref={svgRef}
                viewBox="0 0 1600 900"
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                {/* Protocol Grid Background */}
                <defs>
                    <pattern id="neuralGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05"/>
                    </pattern>
                    <filter id="strokeGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#neuralGrid)" pointerEvents="none" />

                {elements.map(el => {
                    if (el.type === 'path') {
                        return (
                            <path
                                key={el.id}
                                d={pointsToPath(el.points)}
                                stroke={el.color}
                                strokeWidth={el.strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={el.mode === 'highlighter' ? '0.4' : '1'}
                                filter={el.mode === 'pen' ? 'url(#strokeGlow)' : 'none'}
                            />
                        );
                    }
                    if (el.type === 'text') {
                        if (isWriting && textInput.editingElementId === el.id) return null;
                        return (
                            <foreignObject 
                                key={el.id} 
                                x={el.x} 
                                y={el.y} 
                                width={el.width + 20} 
                                height={800}
                                onMouseDown={(e) => handleElementMouseDown(el as WhiteboardTextElement, e)}
                                onDoubleClick={(e) => handleElementDoubleClick(el as WhiteboardTextElement, e)}
                                style={{ cursor: isTeacher && activeTool === 'select' ? 'move' : 'default' }}
                            >
                                 <div style={{ 
                                    color: el.color, 
                                    fontSize: el.fontSize, 
                                    fontWeight: 'bolder', /* Changed to bolder */
                                    fontFamily: 'Montserrat, sans-serif', 
                                    lineHeight: '1.2', 
                                    wordWrap: 'break-word', 
                                    pointerEvents: 'none', 
                                    userSelect: 'none',
                                    textShadow: '0 0 15px rgba(255,255,255,0.2)' /* Added text shadow */
                                 }}>
                                    {el.text}
                                </div>
                            </foreignObject>
                        )
                    }
                    return null;
                })}

                {drawingElement && (
                    <path
                        d={pointsToPath(drawingElement.points)}
                        stroke={drawingElement.color}
                        strokeWidth={drawingElement.strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={drawingElement.mode === 'highlighter' ? '0.4' : '1'}
                        filter={drawingElement.mode === 'pen' ? 'url(#strokeGlow)' : 'none'}
                    />
                )}
            </svg>
            
            {isWriting && (
                <textarea
                    ref={textareaRef}
                    className="absolute bg-transparent border-none outline-none resize-none p-0 overflow-hidden font-montserrat font-extrabold leading-[1.2] shadow-2xl"
                    style={{
                        left: textInput.x,
                        top: textInput.y,
                        width: textInput.width,
                        color: strokeColor,
                        fontSize: 28,
                        minWidth: '300px',
                    }}
                    value={textInput.text}
                    onChange={handleTextChange}
                    onBlur={saveText}
                />
            )}

            {/* Corner Decorative Primitives */}
            <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-white/20 pointer-events-none" />
            <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-white/20 pointer-events-none" />
            <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-white/20 pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-white/20 pointer-events-none" />
        </div>
    );
};

export default Whiteboard;