import uuid from 'uuid/v4';

const getTime = (date)=>{
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export {
  uuid,
  getTime,
  randomNumber,
}