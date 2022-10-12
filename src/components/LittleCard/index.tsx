import React from 'react';
import {Card, CardProps, Text} from 'react-native-paper';

interface LittleCardProps extends Partial<CardProps> {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const LittleCard: React.FC<LittleCardProps> = ({title, subtitle, onPress}) => {
  return (
    <Card onPress={onPress}>
      <Card.Title title={title} />
      <Card.Content>
        <Text>{subtitle}</Text>
      </Card.Content>
    </Card>
  );
};

export default LittleCard;
