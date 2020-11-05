import firebase from "../../firebase";

function addUpVote(user, productId) {
  if (!user) return Promise.reject();

  const prodRef = firebase.db.collection("products").doc(productId);

  return prodRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const previousVotes = data.votes;
      const vote = { votedBy: { id: user.uid, name: user.displayName } };
      const updatedVotes = [...previousVotes, vote];
      const voteCount = updatedVotes.length;
      prodRef.update({ votes: updatedVotes, voteCount });

      return {
        ...data,
        votes: updatedVotes,
        voteCount: voteCount
      };
    }
  });
}

export default { addUpVote };
