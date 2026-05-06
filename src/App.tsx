import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Delete, RotateCcw, Equal, Plus, Minus, X, Divide } from 'lucide-react';
import './App.css';

function App() {
  const [current, setCurrent] = useState<string>('0');
  const [previous, setPrevious] = useState<string>('');
  const [operator, setOperator] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sound/Vibration simulation effect
  const triggerFeedback = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);
  };

  const handleNumber = (num: string) => {
    triggerFeedback();
    if (current === '0' && num !== '.') {
      setCurrent(num);
    } else if (num === '.' && current.includes('.')) {
      return;
    } else if (current.length < 12) {
      setCurrent(current + num);
    }
  };

  const handleOperator = (op: string) => {
    triggerFeedback();
    if (operator && previous && current !== '0') {
      calculate();
    } else if (!previous) {
      setPrevious(current);
    }
    setCurrent('0');
    setOperator(op);
  };

  const calculate = () => {
    triggerFeedback();
    if (!operator || !previous) return;

    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    let result = 0;

    switch (operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case 'x': result = prev * curr; break;
      case '÷':
        if (curr === 0) {
          setCurrent('BRUH');
          setPrevious('');
          setOperator(null);
          return;
        }
        result = prev / curr;
        break;
    }

    const formattedResult = String(Math.round(result * 100000000) / 100000000);
    setCurrent(formattedResult.length > 12 ? formattedResult.slice(0, 12) : formattedResult);
    setPrevious('');
    setOperator(null);
  };

  const handleClear = () => {
    triggerFeedback();
    setCurrent('0');
    setPrevious('');
    setOperator(null);
  };

  const handleDelete = () => {
    triggerFeedback();
    if (current === 'BRUH' || current === 'Error') {
      setCurrent('0');
    } else if (current.length === 1) {
      setCurrent('0');
    } else {
      setCurrent(current.slice(0, -1));
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleNumber(e.key);
      if (e.key === '.') handleNumber('.');
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('x');
      if (e.key === '/') handleOperator('÷');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Backspace') handleDelete();
      if (e.key === 'Escape') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, previous, operator]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delayChildren: 0.2,
        staggerChildren: 0.05
      }
    }
  } as Variants;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  } as Variants;

  return (
    <div className="calculator-wrapper">
      <div className="blob"></div>
      <div className="blob blob-2"></div>

      <motion.div
        className="calculator-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="display-section"
          animate={isAnimating ? { x: [-2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.1 }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={previous + operator}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="prev-val"
            >
              {previous} {operator}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode='wait'>
            <motion.div
              key={current}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="curr-val"
            >
              {current}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="keypad-grid">
          <motion.button variants={itemVariants} className="calc-btn btn-util" onClick={handleClear} whileTap={{ scale: 0.9 }}>
            <RotateCcw size={20} />
          </motion.button>
          <motion.button variants={itemVariants} className="calc-btn btn-util" onClick={handleDelete} whileTap={{ scale: 0.9 }}>
            <Delete size={20} />
          </motion.button>
          <motion.button variants={itemVariants} className="calc-btn btn-op" onClick={() => handleOperator('÷')} whileTap={{ scale: 0.9 }}>
            <Divide size={24} />
          </motion.button>
          <motion.button variants={itemVariants} className="calc-btn btn-op" onClick={() => handleOperator('x')} whileTap={{ scale: 0.9 }}>
            <X size={24} />
          </motion.button>

          {[7, 8, 9].map(num => (
            <motion.button key={num} variants={itemVariants} className="calc-btn" onClick={() => handleNumber(num.toString())} whileTap={{ scale: 0.9 }}>
              {num}
            </motion.button>
          ))}
          <motion.button variants={itemVariants} className="calc-btn btn-op" onClick={() => handleOperator('-')} whileTap={{ scale: 0.9 }}>
            <Minus size={24} />
          </motion.button>

          {[4, 5, 6].map(num => (
            <motion.button key={num} variants={itemVariants} className="calc-btn" onClick={() => handleNumber(num.toString())} whileTap={{ scale: 0.9 }}>
              {num}
            </motion.button>
          ))}
          <motion.button variants={itemVariants} className="calc-btn btn-op" onClick={() => handleOperator('+')} whileTap={{ scale: 0.9 }}>
            <Plus size={24} />
          </motion.button>

          {[1, 2, 3].map(num => (
            <motion.button key={num} variants={itemVariants} className="calc-btn" onClick={() => handleNumber(num.toString())} whileTap={{ scale: 0.9 }}>
              {num}
            </motion.button>
          ))}
          <motion.button variants={itemVariants} className="calc-btn" onClick={() => handleNumber('.')} whileTap={{ scale: 0.9 }}>
            .
          </motion.button>

          <motion.button variants={itemVariants} className="calc-btn btn-zero" onClick={() => handleNumber('0')} whileTap={{ scale: 0.9 }}>
            0
          </motion.button>
          <motion.button variants={itemVariants} className="calc-btn btn-eq" onClick={calculate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Equal size={28} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default App;