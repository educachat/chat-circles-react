import { firebaseDatabase } from '../config/firebase';

class FirebaseService {
  static getDataList = (nodePath, callback, size=10) => {
    let query = firebaseDatabase.ref(nodePath).limitToLast(size);
    query.on('value', dataSnapshot => {
      let items = [];
      dataSnapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item['key'] = childSnapshot.key;
        items.push(item);
      });
      callback(items);
    });
    return query;
  };

  static pushData = (node, objToSubmit) => {
    const ref = firebaseDatabase.ref(node).push();
    const id = firebaseDatabase.ref(node).push().key;
    objToSubmit.sendedAt = Date.now();
    ref.set(objToSubmit);
    return id;
  };

  
}

export default FirebaseService;