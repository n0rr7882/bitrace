import React from 'react';
import MarketListContainer from '../../containers/MarketListContainer';
import { Container, Card, CardActionArea, CardMedia, CardContent, Typography, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  media: {
    height: 256,

  },
  title: {
    fontFamily: 'Orbitron',
    fontWeight: 600,
  },
  sub: {
    marginBottom: 12,
  },
}));

const IndexPage = () => {
  const classes = useStyles();
  const title = <span className={classes.title}>coinance</span>;

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia image="https://picsum.photos/300/200/?blur=3" className={classes.media} />
        </CardActionArea>
        <CardContent>
          <Typography className={classes.title} variant="h2" component="h1">
            {title}
          </Typography>
          <Typography className={classes.sub} color="textSecondary">
            암호화폐 모의투자 거래소
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            대책 없는 <b>'가즈아!'</b> 는 이제 그만! {title} 에서 현명한 암호화폐 투자를 연습하세요!
        </Typography>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <MarketListContainer />
      </Card>
    </Container>
  );
};

export default IndexPage;
