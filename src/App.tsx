import { createTheme, ThemeProvider } from "ingred-ui";
import { useEffect, useRef, useState } from "react";

const Canvas = ({ data }: { data: Array<number> }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const drawGraph = (context: CanvasRenderingContext2D) => {
    const yMax = Math.max.apply({}, data);
    const heightSpace = 100;
    const widthSpace = 100;
    const height = ref.current?.height ? ref.current.height - heightSpace : 720;
    const width = ref.current?.width ? ref.current.width - widthSpace : 1280;

    const groundX = widthSpace;
    const groundY = heightSpace;

    const pitchX = widthSpace / data.length;
    const pitchY = heightSpace / yMax;

    // X
    context.beginPath();
    context.moveTo(groundX, groundY);
    context.lineTo(groundX, height);
    context.stroke();
    for (let i = 0; i <= yMax; i += 100) {
      const y = height - i * pitchY * 5;
      console.log(height, i, pitchY, y);
      context.beginPath();
      context.moveTo(groundX, y);
      context.lineTo(groundX - 5, y);
      context.stroke();
      context.textAlign = "right";
      context.textBaseline = "middle";
      context.font = "10pt Arial";
      context.fillText(i.toString(), groundX - 10, y);
    }

    // Y
    context.beginPath();
    context.moveTo(groundX, height);
    context.lineTo(width, height);
    context.stroke();
    for (let i = 0; i < data.length; i++) {
      const x = groundX + i * pitchX * 10;
      context.beginPath();
      context.moveTo(x, height);
      context.lineTo(x, height + 5);
      context.stroke();
      context.textAlign = "center";
      context.textBaseline = "top";
      context.font = "10pt Arial";
      context.fillText(i.toString(), x, height + 10);
    }

    // Title
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "12pt Arial";
    context.fillText("タイトル", width / 2, 30);

    // Graph
    context.beginPath();
    context.moveTo(groundX, height - data[0] * pitchY * 5);
    for (let i = 1; i < data.length; i++) {
      const x = groundX + i * pitchX * 10;
      const y = height - data[i] * pitchY * 5;
      context.lineTo(x, y);
      context.moveTo(x, y);
      context.arc(x, y, 3, 0, Math.PI * 2, false);
      context.stroke();
      context.fillText(data[i].toString(), x, y - 10);
    }
  };

  useEffect(() => {
    const canvas = ref.current;
    if (canvas === null) {
      return;
    }

    const canvasContext = canvas.getContext("2d");
    setContext(canvasContext);
  }, []);

  useEffect(() => {
    if (context !== null) {
      const img = new Image();
      Object.assign(img, {
        src: "https://takurinton.dev/me.jpeg",
        onload: drawGraph(context),
      });
    }
  }, [context]);

  return <canvas ref={ref} width="1280" height="720"></canvas>;
};

const data = [100, 200, 100, 300, 600, 1000, 200];

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Canvas data={data} />
    </ThemeProvider>
  );
}

export default App;
