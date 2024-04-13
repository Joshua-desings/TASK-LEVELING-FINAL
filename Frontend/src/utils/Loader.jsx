import React from "react";
import { useSpring, animated } from "react-spring";
import GamepadIcon from "@mui/icons-material/Gamepad";

const Loader = ({ loading }) => {
  // Definir la animación para el loader
  const { opacity, transform } = useSpring({
    opacity: loading ? 1 : 0,
    transform: loading ? "rotate(720deg) scale(1.2)" : "rotate(0deg) scale(1)",
    config: { tension: 150, friction: 45 },
    from: { opacity: 0, transform: "rotate(0deg) scale(1)" },
  });

  return (
    <animated.div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        opacity,
      }}
    >
      <animated.div style={{ transform }}>
        <GamepadIcon style={{ fontSize: 70, color: "#333333" }} />
      </animated.div>
    </animated.div>
  );
};

export default Loader;
