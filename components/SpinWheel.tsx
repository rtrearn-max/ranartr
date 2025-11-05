import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface SpinWheelProps {
  values: number[];
  enabled: boolean;
  spinsRemaining?: number;
  onSpin?: (wonAmount: number) => void;
}

export default function SpinWheel({ values, enabled, spinsRemaining = 1, onSpin }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (!enabled || spinsRemaining <= 0 || isSpinning) return;

    setIsSpinning(true);
    setWonAmount(null);

    const randomIndex = Math.floor(Math.random() * values.length);
    const wonValue = values[randomIndex];
    const degreesPerSegment = 360 / values.length;
    const targetRotation = rotation + 360 * 5 + (randomIndex * degreesPerSegment);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonAmount(wonValue);
      onSpin?.(wonValue);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Spin Wheel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex items-center justify-center">
          <motion.div
            className="w-64 h-64 rounded-full relative overflow-hidden border-4 border-primary"
            style={{
              background: `conic-gradient(from 0deg, ${values.map((_, i) => {
                const startAngle = (i * 360) / values.length;
                const endAngle = ((i + 1) * 360) / values.length;
                const color = i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--chart-1))';
                return `${color} ${startAngle}deg ${endAngle}deg`;
              }).join(', ')})`,
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.17, 0.67, 0.12, 0.99] }}
          >
            {values.map((value, index) => {
              const angle = (360 / values.length) * index;
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{
                    transform: `rotate(${angle}deg) translateX(70px)`,
                  }}
                >
                  <span className="text-white font-bold text-sm">{value}</span>
                </div>
              );
            })}
          </motion.div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-destructive" />
          </div>
        </div>

        <AnimatePresence>
          {wonAmount !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-4 bg-success/10 rounded-md"
            >
              <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-success">
                You won {wonAmount} coins!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Spins remaining today: <span className="font-bold">{spinsRemaining}</span>
          </p>
          <Button
            className="w-full"
            size="lg"
            disabled={!enabled || spinsRemaining <= 0 || isSpinning}
            onClick={handleSpin}
            data-testid="button-spin-wheel"
          >
            {isSpinning ? 'Spinning...' : spinsRemaining <= 0 ? 'No Spins Left' : 'Spin Now!'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
