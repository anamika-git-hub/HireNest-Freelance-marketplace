import * as Yup from 'yup';

const ContractValidationSchema = (context:any) =>
    Yup.object().shape({
    title: Yup.string().required("Title is required"),
    budget: Yup.number().positive("Budget must be positive").required("Budget is required"),
    description: Yup.string().required("Description is required"),
    milestones: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Milestone title is required"),
        cost: Yup.number().positive("Cost must be positive").required("Cost is required").test(
          "cost-match",
          "Total milestone cost must match budget",
          function(value) {
            if (!value || !context.budget || !context.milestones) return false;
            const totalMilestoneCost = context.milestones?.reduce(
              (acc: number, curr: any) => acc + Number(curr.cost || 0),
              0
            );
            return totalMilestoneCost === Number(context.budget);
          }
        ),
      })
    ),
})
  export default ContractValidationSchema;