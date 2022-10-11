import React from 'react';
import {Card, Text} from 'react-native-paper';

interface LittleCardProps {
  title: string;
  subtitle: string;
}

const LittleCard: React.FC<LittleCardProps> = ({title, subtitle}) => {
  return (
    <Card>
      <Card.Title title={title} />
      <Card.Content>
        <Text>{subtitle}</Text>
      </Card.Content>
    </Card>
  );
};

export default LittleCard;
