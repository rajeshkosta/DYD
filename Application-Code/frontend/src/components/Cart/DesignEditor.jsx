import { message } from "antd";
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const DesignEditor = forwardRef(({ tShirtImage, logoImage, logoPos, setLogoPos, onExport }, ref) => {
    const [tshirt] = useImage(tShirtImage, 'anonymous');
    const [logo] = useImage(logoImage, 'anonymous');
    const shapeRef = useRef();
    const trRef = useRef();
    const stageRef = useRef();

    console.log("logo image in design", logoImage);
    

    // 🔥 Expose method to parent
    // useImperativeHandle(ref, () => ({
    //     exportCanvas: () => {
    //         const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    //         if (onExport) {
    //             onExport(uri); // Send to parent
    //         }
    //         return uri;
    //     }
    // }));

    const handleExport = () => {
        const uri = stageRef.current.toDataURL();
        onExport(uri);
        message.success('Design saved successfully!');
    };

    return (
        <div >

            <Stage width={400} height={400} ref={stageRef}>
                <Layer>
                    {tshirt && <KonvaImage image={tshirt} width={400} height={400} />}
                    {logo && (
                        <>
                            <KonvaImage
                                image={logo}
                                x={logoPos.x}
                                y={logoPos.y}
                                width={logoPos.width}
                                height={logoPos.height}
                                draggable
                                onDragEnd={(e) => {
                                    setLogoPos({
                                        ...logoPos,
                                        x: e.target.x(),
                                        y: e.target.y(),
                                    });
                                }}
                                onTransformEnd={(e) => {
                                    const node = shapeRef.current;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();
                                    setLogoPos({
                                        ...logoPos,
                                        x: node.x(),
                                        y: node.y(),
                                        width: node.width() * scaleX,
                                        height: node.height() * scaleY,
                                    });
                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                            // ref={shapeRef}
                            />
                            {/* <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => newBox} /> */}
                        </>
                    )}
                </Layer>
            </Stage>

            <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                 onClick={handleExport}>Save Design</button>
            </div>

        </div>
    );
});

export default DesignEditor;
