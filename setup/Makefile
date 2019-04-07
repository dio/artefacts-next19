REGION=us-west2
ZONE=us-west2-a
PROJECT=copenhagen-233121

FRONTEND_INSTANCE_GROUP=frontend
USER_INSTANCE_GROUP=user

IMAGE_PROJECT=ubuntu-os-cloud
IMAGE_FAMILY=ubuntu-1604-lts

# bastion
bastion/create:
	gcloud compute instances create --zone ${ZONE} \
		--project ${PROJECT} \
		--image-family ${IMAGE_FAMILY} \
		--image-project ${IMAGE_PROJECT} \
		--scopes cloud-platform \
		bastion

bastion/delete:
	gcloud compute instances delete --zone ${ZONE} --project ${PROJECT} bastion

bastion/ssh:
	gcloud compute --project ${PROJECT} ssh --zone ${ZONE} bastion

# frontend
frontend/create:
	gcloud alpha compute instances create --zone ${ZONE} \
		--project ${PROJECT} \
		--image-family ${IMAGE_FAMILY} \
		--image-project ${IMAGE_PROJECT} \
		--scopes cloud-platform \
		--tags http-server \
		frontend

frontend/group/create:
	gcloud compute instance-groups unmanaged create --zone ${ZONE} \
		--project ${PROJECT} \
		${FRONTEND_INSTANCE_GROUP}

frontend/move/group:
	gcloud compute instance-groups unmanaged add-instances --zone ${ZONE} \
	 	--project ${PROJECT} \
		${FRONTEND_INSTANCE_GROUP} \
		--instances=frontend

frontend/group/delete:
	gcloud compute instance-groups unmanaged delete --zone ${ZONE} --project ${PROJECT} ${FRONTEND_INSTANCE_GROUP}

frontend/delete: frontend/group/delete
	gcloud compute instances delete --zone ${ZONE} --project ${PROJECT} frontend

# user
user/create:
	gcloud alpha compute instances create --zone ${ZONE} \
		--project ${PROJECT} \
		--image-family ${IMAGE_FAMILY} \
		--image-project ${IMAGE_PROJECT} \
		--scopes cloud-platform \
		user-1 user-2

user/group/create:
	gcloud compute instance-groups unmanaged create --zone ${ZONE} \
		--project ${PROJECT} \
		${FRONTEND_INSTANCE_GROUP}

user/move/group:
	gcloud compute instance-groups unmanaged add-instances --zone ${ZONE} \
	 	--project ${PROJECT} \
		${FRONTEND_INSTANCE_GROUP} \
		--instances=user-1

user/group/delete: user/delete
	gcloud compute instance-groups unmanaged delete --zone ${ZONE} --project ${PROJECT} ${FRONTEND_INSTANCE_GROUP}

user/delete:
	gcloud compute instances delete --zone ${ZONE} --project ${PROJECT} frontend

user-1/ssh:
	gcloud compute --project ${PROJECT} ssh --zone ${ZONE} vm-1

frontend/ssh:
	gcloud compute --project ${PROJECT} ssh --zone ${ZONE} frontend

all/delete: bastion/delete frontend/delete user/delete
